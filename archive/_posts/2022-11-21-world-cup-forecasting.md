---
layout: post
title: Forecasting the 2022 World Cup
subtitle: How I used Elo Ratings and Monte Carlo simulation to enter the Essex Department of Government World Cup Prediction Contest
tags: ["R"]
---

I recently entered a world cup prediction contest in the Department of Government at Essex University. This isn't super-abnormal, except that my football knowledge is marginally less than my chances of home ownership.

Not being willing to let that stop me, I decided to turn to my skills in programming and data science to see if they could help me. After doing some research, I settled on building an elo ranking system to generate my predictions for me.

If you're from the world of chess, you'll be familiar with an elo ranting system. The basic idea is you give everyone a starting rating. Then, as they play games against each other, their elo ratings get updated. If you beat a player with a much lower rating, you don't gain many points. If you beat a player with a much higher rating, you gain many points. And vice versa for losing points.

Elo rating systems have a lot of appeal for football prediction. They implicitly handle the time factor: as teams get better and worse, their elo scores will average out accordingly. They also come with a ready-made formula for producing win probabilities.

The one thing it may handle poorly in this case is rating teams across continents. Since teams play more often within continent, the predictions here may suffer somewhat from a lack of updates across continents outside major events.

Throughout this blog post, I'll share some of my code snippets from R. However, since all of the code is available in a github repo at [this link](https://github.com/philswatton/worldcup-2022), I won't set it out in full here.

## Data

Before implementing any kind of predictive algorithm or model, I need data to base it on. Forunately, there's a nice dataset of basically most (all?) historic international football matches currently being maintained by Mart Jürisoo available on Kaggle[^1].

There's also a nice dataset of fixture dates available on the creatively named Fixture Dates website[^2], which nicely avoids most of the need to manually code these.

I therefore used these two datasets throughout the modelling process.


## Elo Ratings

There are two main decisions to be made when building elo ratings:
- Start values
- Computing the updates

I'll now go through both of these in turn.

<!-- The basic idea of elo ratings is that everyone starts with the same score. From here, as they play games, you update their scores based on their previous scores. If player A has a much larger score than player B, you'd expect player A to win - so if they do, you don't update either elo score that much. By contrast, if player B wins - you update both scores a lot (A goes down, B goes up). -->

### Initial Ratings

In my procedure, I started all teams with a rating of 1500. In the world elo rankings some slightly different starts were used[^3], but that ultimately should have a relatively marginal effect.

```
team_ratings <- data.frame(
  team = unique(c(matches$home_team, matches$away_team)),
  rating = 1500
)
```

I chose 1500 simply because it's a relatively standard choice - no special reasons or motivations here. Regardless, after roughly ~30 games, ratings should reach their 'correct' value. And there are a lot more than 30 here!

### Update Algorithm

Once that was done, the big thing to implement is the iterative update algorithm. At the time of writing there are 44,060 matches in the dataset, starting in 1872.

The eloratings.net update is calculated as[^3]

$$ R_n = R_o + K \times (W - W_e) $$

where \\(R_n\\) is the new elo rating, \\(R_o\\) is the old elo rating, \\(K\\) is an importance value, \\(W\\) is the result, and \\(W_e\\) is the expected result. These last three terms obviously need some defining.

Starting with the importance value, \\(K\\), this essentially determines the size of the update. At about 1, there's barely any update. At 100, the update is usually too large. 30 is a fairly standard value[^4]. The eloratings.net use the following values, conditional on the matches being played[^3]:

- **60** for world cup finals
- **50** for continental championship finals and major intercontinental tournaments
- **40** for World Cup and continental qualifiers and major tournaments
- **30** for all other tournaments
- **20** for friendly matches

From here, in the eloratings.net calculation \\(K\\) is adjusted based on the goal difference in the game[^4]. For games where the goal difference is 2, it is increased by \\(\frac{1}{2}\\). Where the goal difference is 3, it's increased by \\(\frac{3}{4}\\). Where the goal difference is 4 or more, it is increased by \\(\frac{3}{4} + \frac{N-3}{8}\\).

I used a value of 30 across all games, but kept the goal multiplier as set out above. This was largely because after some initial trial and error along with some quick eyeballing of results (and comparing them to the World Elo Ratings), this just seemed to produce the most sensible results. We'll see how far off that statement is at the end of December!

The observed result \\(W\\) is simple in its definition:

- **1** for a win
- **0.5** for a tie
- **0** for a loss

The expected result \\(W_e\\) is calculated as

$$ W_e = \frac{1}{10(\frac{-dr}{400}) + 1} $$

where \\(dr\\) is the difference in ratings between the teams, plus 100 for the home team.

You *could* compute this for both teams (remembering to flip the 100 for the away team, but this value for both teams sums to 1.

So, with all the pieces in place, I implemented a loop in R over all matches (minus one with missing scores)

```
# Loop over matches
for (i in 1:nrow(matches)) {
  
  # Teams
  home_team <- matches$home_team[i]
  away_team <- matches$away_team[i]
  
  # Current ratings
  rating_home <- team_ratings$rating[team_ratings$team == home_team]
  rating_away <- team_ratings$rating[team_ratings$team == away_team]
  
  # Compute expected result for both teams
  expected_home = 1 / (1 + 10**(-(rating_home - rating_away + 100)/400))
  expected_away = 1 - expected_home
  
  # Update ratings
  team_ratings$rating[team_ratings$team == home_team] <- rating_home + matches$importance[i] * (matches$result[i] - expected_home)
  team_ratings$rating[team_ratings$team == away_team] <- rating_away + matches$importance[i] * (1 - matches$result[i] - expected_away)
  
}

# World Cup Team Elo Ratings
teams <- team_ratings %>% filter(team %in% unique(c(fixtures$`Home Team`, fixtures$`Away Team`)))
```

Here's the top 5 teams:

```
teams %>% arrange(rating) %>% `[`(32:1,) %>% head(5)

          team   rating
30      Brazil 2217.258
29   Argentina 2175.373
28       Spain 2092.173
27 Netherlands 2089.409
26     Belgium 2049.297
```

Reassuringly, these are the same top 5 as eloratings.net[^3], with the same rank order. The scores are slightly different, but this shouldn't dramatically alter things.


## Monte Carlo Simulation

With elo ratings calculated, the final task was to use these to produce a Monte Carlo simulation of the World Cup based on these ratings. A Monte Carlo simulation is one in which the several draws are made from a random simulation. Since there's a lot of randomness in football results, this is useful for my purposes!

For those not in the know, the world cup stages are done as follows:
- The first stage is the 'group stages'
    - 32 teams in 8 groups
    - 3 points for a win, 1 point for a draw
    - 1st and 2nd place in the group go forward
    - 48 games total
- Victors go to the 'last 16' stage.
    - 8 games
    - The pattern is Group A 1st vs Group B 2nd, Group B 1st vs Group A 2nd
- Winners from the ast 16 play in the 4 quarter-finals
- Winners from the quarters play in the 2 semi-finals
- Winners from the semi-finals play in the final

That's a lot of predictions to make! So, Monte Carlo to the rescue.

I did include one simplificaiton: I skipped out the points system for the group stage, and simple sampled for winners and losers. Hopefully this isn't *too* drastic a simplification. However, it nicely avoids the issue of deciding thresholds for loss, win, and draw on a 0-1 range. Obviously if I wanted to predict points, it would be a different story.

Since I don't however, I used the elo expected win formula, but dropped the +100 component for home teams. Typically home teams do do better in the World Cup, but I suspected this may not be the case in Qatar (and at the time of writing this instinct seems initially vindicated by the first game - the first time the hosts have lost the opening game).

I therefore coded up a fairly hefty for loop for the simulation. Given more time, I would have refactored it to (mostly) re-use a single function. As-is, there's a lot of code duplication. It starts with probabilities for the 48 group-stage games, which can simply be generated by using the elo rankings. From here, work out the next fixtures based on 1st and 2nd places, then compute new probabilities, then rinse and repeat.

Here's an example from the loop for the quarter finals:

```
fixtures_quarter <- data.frame(
    home_team = c(teams_16[seq(1,7,2)]),
    away_team = c(teams_16[seq(2,8,2)])
  ) %>% left_join(teams %>% 
                    rename(home_team = team,
                           rating_home = rating),
                  by = "home_team") %>%
    left_join(teams %>% 
                rename(away_team = team,
                       rating_away = rating),
              by = "away_team") %>%
    mutate(home_win = 1 / (1 + 10**(-(rating_home - rating_away)/400)))
  
  # Simulate quarter results
  num_quarter <- 4
  wins_quarter <- rep(NA_real_, num_quarter)
  for (i in 1:num_quarter) {
    wins_quarter[i] <- sample(c(0,1), 1, prob=c(1 - fixtures_quarter$home_win[i], fixtures_quarter$home_win[i]))
  }
  
  # Vector of 16s results
  teams_quarter <- vector(mode='character', length=num_quarter)
  for (i in 1:num_quarter) {
    teams_quarter[i] <- ifelse(wins_quarter[i] == 1, fixtures_quarter$home_team[i], fixtures_quarter$away_team[i])
  }
```

I ran this simulation 25,000 times. I would have preferred to run it for longer, but in the end I needed to run it pretty close to the wire (i.e. before the first game had begun) to get my submission to the Essex contest in on time. Had I had more time, I probably would've run it for something closer to about 100,000 times.

## Results

Here, I'm going to focus mostly on results relevant to the Essex prediction contest, with a lot of reference to the points system in that . Where relevant however, I'll note some files in the github repo that contain some extra predictions. Since at a later point I may produce a second blog post with some Breir scores for this prediction and others, I'll be including some probabilities.

### Group Rank Order

The first requirement was to predict the rank order of teams in the group stages, at 2pts a pop. Individual game predictions were made using elo ratings alone, and are in the `results/results_01_group_fixtures.csv` file.

Here are my predicted group order results (with teams ordered from 1st to last):

<table class='gmisc_table' style='border-collapse: collapse; margin-top: 1em; margin-bottom: 1em;' >
<thead>
<tr><th style='border-bottom: 1px solid grey; border-top: 2px solid grey;'></th>
<th style='font-weight: 900; border-bottom: 1px solid grey; border-top: 2px solid grey; text-align: center;'>Order</th>
<th style='font-weight: 900; border-bottom: 1px solid grey; border-top: 2px solid grey; text-align: center;'>Probability</th>
</tr>
</thead>
<tbody>
<tr>
<td style='text-align: left;'>Group A</td>
<td style='text-align: center;'>Netherlands, Ecuador, Senegal, Qatar</td>
<td style='text-align: center;'>15.8</td>
</tr>
<tr>
<td style='text-align: left;'>Group B</td>
<td style='text-align: center;'>England, Iran, USA, Wales</td>
<td style='text-align: center;'>9.9</td>
</tr>
<tr>
<td style='text-align: left;'>Group C</td>
<td style='text-align: center;'>Argentina, Mexico, Poland, Saudi Arabia</td>
<td style='text-align: center;'>17.9</td>
</tr>
<tr>
<td style='text-align: left;'>Group D</td>
<td style='text-align: center;'>France, Denmark, Australia, Tunisia</td>
<td style='text-align: center;'>13.5</td>
</tr>
<tr>
<td style='text-align: left;'>Group E</td>
<td style='text-align: center;'>Spain, Germany, Japan, Costa Rica</td>
<td style='text-align: center;'>13.8</td>
</tr>
<tr>
<td style='text-align: left;'>Group F</td>
<td style='text-align: center;'>Belgium, Croatia, Morocco, Canada</td>
<td style='text-align: center;'>12.5</td>
</tr>
<tr>
<td style='text-align: left;'>Group G</td>
<td style='text-align: center;'>Brazil, Switzerland, Serbia, Cameroon</td>
<td style='text-align: center;'>21.9</td>
</tr>
<tr>
<td style='border-bottom: 2px solid grey; text-align: left;'>Group H</td>
<td style='border-bottom: 2px solid grey; text-align: center;'>Portugal, Uruguay, South Korea, Ghana</td>
<td style='border-bottom: 2px solid grey; text-align: center;'>15.2</td>
</tr>
</tbody>
</table>

All in all, each rank order has a fairly low probability. This shouldn't be surprising - each group has 24 different possible outcomes! Group B looks like the one most likely to produce interesting results, while group G seems the most predictable (though by means settled according to the simulation).

## Team Progression Points

The next set of points was for predicting which teams would get through to the last 16 stage, with one point each. These were based on the above rank order submission.

It's worth presenting these together, as most other predictions took on this character. There were 2 points for each team reaching the quarter-finals, 2 points for each team reaching the semi-infals, 2 points for each team reaching the final, and 3 points for predicting the winner.

Here are all the probabilities I have for these quantities:

<table class='gmisc_table' style='border-collapse: collapse; margin-top: 1em; margin-bottom: 1em;' >
<thead>
<tr><th style='border-bottom: 1px solid grey; border-top: 2px solid grey;'></th>
<th style='font-weight: 900; border-bottom: 1px solid grey; border-top: 2px solid grey; text-align: center;'>Last 16</th>
<th style='font-weight: 900; border-bottom: 1px solid grey; border-top: 2px solid grey; text-align: center;'>Quarter Finals</th>
<th style='font-weight: 900; border-bottom: 1px solid grey; border-top: 2px solid grey; text-align: center;'>Semi Finals</th>
<th style='font-weight: 900; border-bottom: 1px solid grey; border-top: 2px solid grey; text-align: center;'>Finals</th>
<th style='font-weight: 900; border-bottom: 1px solid grey; border-top: 2px solid grey; text-align: center;'>Win</th>
</tr>
</thead>
<tbody>
<tr>
<td style='text-align: left;'>Brazil</td>
<td style='background-color:RGB(25, 255, 25); text-align: center;'>90.2</td>
<td style='background-color:RGB(80, 255, 80); text-align: center;'>68.6</td>
<td style='background-color:RGB(128, 255, 128); text-align: center;'>50</td>
<td style='background-color:RGB(166, 255, 166); text-align: center;'>34.9</td>
<td style='background-color:RGB(191, 255, 191); text-align: center;'>25.1</td>
</tr>
<tr>
<td style='text-align: left;'>Argentina</td>
<td style='background-color:RGB(23, 255, 23); text-align: center;'>91</td>
<td style='background-color:RGB(87, 255, 87); text-align: center;'>65.9</td>
<td style='background-color:RGB(133, 255, 133); text-align: center;'>47.8</td>
<td style='background-color:RGB(182, 255, 182); text-align: center;'>28.8</td>
<td style='background-color:RGB(207, 255, 207); text-align: center;'>18.7</td>
</tr>
<tr>
<td style='text-align: left;'>Spain</td>
<td style='background-color:RGB(55, 255, 55); text-align: center;'>78.5</td>
<td style='background-color:RGB(123, 255, 123); text-align: center;'>51.8</td>
<td style='background-color:RGB(185, 255, 185); text-align: center;'>27.6</td>
<td style='background-color:RGB(214, 255, 214); text-align: center;'>15.9</td>
<td style='background-color:RGB(233, 255, 233); text-align: center;'>8.5</td>
</tr>
<tr>
<td style='text-align: left;'>France</td>
<td style='background-color:RGB(58, 255, 58); text-align: center;'>77.3</td>
<td style='background-color:RGB(136, 255, 136); text-align: center;'>46.5</td>
<td style='background-color:RGB(181, 255, 181); text-align: center;'>29.1</td>
<td style='background-color:RGB(216, 255, 216); text-align: center;'>15.1</td>
<td style='background-color:RGB(237, 255, 237); text-align: center;'>7.1</td>
</tr>
<tr>
<td style='text-align: left;'>Belgium</td>
<td style='background-color:RGB(58, 255, 58); text-align: center;'>77.3</td>
<td style='background-color:RGB(141, 255, 141); text-align: center;'>44.9</td>
<td style='background-color:RGB(194, 255, 194); text-align: center;'>23.8</td>
<td style='background-color:RGB(221, 255, 221); text-align: center;'>13.2</td>
<td style='background-color:RGB(239, 255, 239); text-align: center;'>6.2</td>
</tr>
<tr>
<td style='text-align: left;'>Netherlands</td>
<td style='background-color:RGB(50, 255, 50); text-align: center;'>80.5</td>
<td style='background-color:RGB(124, 255, 124); text-align: center;'>51.2</td>
<td style='background-color:RGB(189, 255, 189); text-align: center;'>25.9</td>
<td style='background-color:RGB(222, 255, 222); text-align: center;'>12.8</td>
<td style='background-color:RGB(239, 255, 239); text-align: center;'>6.3</td>
</tr>
<tr>
<td style='text-align: left;'>Portugal</td>
<td style='background-color:RGB(72, 255, 72); text-align: center;'>71.8</td>
<td style='background-color:RGB(168, 255, 168); text-align: center;'>34.1</td>
<td style='background-color:RGB(209, 255, 209); text-align: center;'>18.1</td>
<td style='background-color:RGB(231, 255, 231); text-align: center;'>9.5</td>
<td style='background-color:RGB(245, 255, 245); text-align: center;'>3.9</td>
</tr>
<tr>
<td style='text-align: left;'>England</td>
<td style='background-color:RGB(80, 255, 80); text-align: center;'>68.8</td>
<td style='background-color:RGB(152, 255, 152); text-align: center;'>40.3</td>
<td style='background-color:RGB(204, 255, 204); text-align: center;'>19.9</td>
<td style='background-color:RGB(233, 255, 233); text-align: center;'>8.6</td>
<td style='background-color:RGB(246, 255, 246); text-align: center;'>3.6</td>
</tr>
<tr>
<td style='text-align: left;'>Uruguay</td>
<td style='background-color:RGB(75, 255, 75); text-align: center;'>70.5</td>
<td style='background-color:RGB(171, 255, 171); text-align: center;'>33.1</td>
<td style='background-color:RGB(211, 255, 211); text-align: center;'>17.1</td>
<td style='background-color:RGB(233, 255, 233); text-align: center;'>8.5</td>
<td style='background-color:RGB(246, 255, 246); text-align: center;'>3.5</td>
</tr>
<tr>
<td style='text-align: left;'>Denmark</td>
<td style='background-color:RGB(90, 255, 90); text-align: center;'>64.7</td>
<td style='background-color:RGB(172, 255, 172); text-align: center;'>32.5</td>
<td style='background-color:RGB(210, 255, 210); text-align: center;'>17.7</td>
<td style='background-color:RGB(235, 255, 235); text-align: center;'>7.7</td>
<td style='background-color:RGB(248, 255, 248); text-align: center;'>2.9</td>
</tr>
<tr>
<td style='text-align: left;'>Germany</td>
<td style='background-color:RGB(100, 255, 100); text-align: center;'>60.6</td>
<td style='background-color:RGB(172, 255, 172); text-align: center;'>32.7</td>
<td style='background-color:RGB(218, 255, 218); text-align: center;'>14.4</td>
<td style='background-color:RGB(238, 255, 238); text-align: center;'>6.8</td>
<td style='background-color:RGB(248, 255, 248); text-align: center;'>2.6</td>
</tr>
<tr>
<td style='text-align: left;'>Switzerland</td>
<td style='background-color:RGB(121, 255, 121); text-align: center;'>52.4</td>
<td style='background-color:RGB(190, 255, 190); text-align: center;'>25.4</td>
<td style='background-color:RGB(225, 255, 225); text-align: center;'>11.6</td>
<td style='background-color:RGB(242, 255, 242); text-align: center;'>5.1</td>
<td style='background-color:RGB(250, 255, 250); text-align: center;'>2</td>
</tr>
<tr>
<td style='text-align: left;'>Iran</td>
<td style='background-color:RGB(110, 255, 110); text-align: center;'>56.7</td>
<td style='background-color:RGB(182, 255, 182); text-align: center;'>28.8</td>
<td style='background-color:RGB(225, 255, 225); text-align: center;'>11.9</td>
<td style='background-color:RGB(244, 255, 244); text-align: center;'>4.5</td>
<td style='background-color:RGB(251, 255, 251); text-align: center;'>1.5</td>
</tr>
<tr>
<td style='text-align: left;'>Croatia</td>
<td style='background-color:RGB(109, 255, 109); text-align: center;'>57.4</td>
<td style='background-color:RGB(188, 255, 188); text-align: center;'>26.3</td>
<td style='background-color:RGB(229, 255, 229); text-align: center;'>10.3</td>
<td style='background-color:RGB(244, 255, 244); text-align: center;'>4.5</td>
<td style='background-color:RGB(251, 255, 251); text-align: center;'>1.6</td>
</tr>
<tr>
<td style='text-align: left;'>Ecuador</td>
<td style='background-color:RGB(112, 255, 112); text-align: center;'>55.9</td>
<td style='background-color:RGB(189, 255, 189); text-align: center;'>25.9</td>
<td style='background-color:RGB(230, 255, 230); text-align: center;'>9.8</td>
<td style='background-color:RGB(246, 255, 246); text-align: center;'>3.6</td>
<td style='background-color:RGB(252, 255, 252); text-align: center;'>1.1</td>
</tr>
<tr>
<td style='text-align: left;'>Serbia</td>
<td style='background-color:RGB(143, 255, 143); text-align: center;'>43.9</td>
<td style='background-color:RGB(206, 255, 206); text-align: center;'>19.3</td>
<td style='background-color:RGB(236, 255, 236); text-align: center;'>7.6</td>
<td style='background-color:RGB(247, 255, 247); text-align: center;'>3</td>
<td style='background-color:RGB(253, 255, 253); text-align: center;'>0.9</td>
</tr>
<tr>
<td style='text-align: left;'>USA</td>
<td style='background-color:RGB(138, 255, 138); text-align: center;'>45.9</td>
<td style='background-color:RGB(202, 255, 202); text-align: center;'>20.7</td>
<td style='background-color:RGB(236, 255, 236); text-align: center;'>7.6</td>
<td style='background-color:RGB(248, 255, 248); text-align: center;'>2.6</td>
<td style='background-color:RGB(253, 255, 253); text-align: center;'>0.8</td>
</tr>
<tr>
<td style='text-align: left;'>Mexico</td>
<td style='background-color:RGB(137, 255, 137); text-align: center;'>46.1</td>
<td style='background-color:RGB(210, 255, 210); text-align: center;'>17.5</td>
<td style='background-color:RGB(237, 255, 237); text-align: center;'>7</td>
<td style='background-color:RGB(250, 255, 250); text-align: center;'>2</td>
<td style='background-color:RGB(254, 255, 254); text-align: center;'>0.5</td>
</tr>
<tr>
<td style='text-align: left;'>South Korea</td>
<td style='background-color:RGB(143, 255, 143); text-align: center;'>44</td>
<td style='background-color:RGB(218, 255, 218); text-align: center;'>14.5</td>
<td style='background-color:RGB(241, 255, 241); text-align: center;'>5.5</td>
<td style='background-color:RGB(250, 255, 250); text-align: center;'>1.9</td>
<td style='background-color:RGB(253, 255, 253); text-align: center;'>0.6</td>
</tr>
<tr>
<td style='text-align: left;'>Senegal</td>
<td style='background-color:RGB(141, 255, 141); text-align: center;'>44.7</td>
<td style='background-color:RGB(209, 255, 209); text-align: center;'>18</td>
<td style='background-color:RGB(240, 255, 240); text-align: center;'>5.8</td>
<td style='background-color:RGB(250, 255, 250); text-align: center;'>1.8</td>
<td style='background-color:RGB(254, 255, 254); text-align: center;'>0.4</td>
</tr>
<tr>
<td style='text-align: left;'>Japan</td>
<td style='background-color:RGB(164, 255, 164); text-align: center;'>35.7</td>
<td style='background-color:RGB(218, 255, 218); text-align: center;'>14.5</td>
<td style='background-color:RGB(243, 255, 243); text-align: center;'>4.7</td>
<td style='background-color:RGB(250, 255, 250); text-align: center;'>1.8</td>
<td style='background-color:RGB(253, 255, 253); text-align: center;'>0.6</td>
</tr>
<tr>
<td style='text-align: left;'>Poland</td>
<td style='background-color:RGB(151, 255, 151); text-align: center;'>40.8</td>
<td style='background-color:RGB(219, 255, 219); text-align: center;'>14.3</td>
<td style='background-color:RGB(241, 255, 241); text-align: center;'>5.4</td>
<td style='background-color:RGB(251, 255, 251); text-align: center;'>1.6</td>
<td style='background-color:RGB(254, 255, 254); text-align: center;'>0.4</td>
</tr>
<tr>
<td style='text-align: left;'>Morocco</td>
<td style='background-color:RGB(162, 255, 162); text-align: center;'>36.6</td>
<td style='background-color:RGB(223, 255, 223); text-align: center;'>12.5</td>
<td style='background-color:RGB(246, 255, 246); text-align: center;'>3.6</td>
<td style='background-color:RGB(252, 255, 252); text-align: center;'>1.2</td>
<td style='background-color:RGB(254, 255, 254); text-align: center;'>0.3</td>
</tr>
<tr>
<td style='text-align: left;'>Australia</td>
<td style='background-color:RGB(177, 255, 177); text-align: center;'>30.6</td>
<td style='background-color:RGB(230, 255, 230); text-align: center;'>10</td>
<td style='background-color:RGB(246, 255, 246); text-align: center;'>3.7</td>
<td style='background-color:RGB(252, 255, 252); text-align: center;'>1</td>
<td style='background-color:RGB(254, 255, 254); text-align: center;'>0.2</td>
</tr>
<tr>
<td style='text-align: left;'>Wales</td>
<td style='background-color:RGB(182, 255, 182); text-align: center;'>28.6</td>
<td style='background-color:RGB(229, 255, 229); text-align: center;'>10.3</td>
<td style='background-color:RGB(247, 255, 247); text-align: center;'>3</td>
<td style='background-color:RGB(253, 255, 253); text-align: center;'>0.9</td>
<td style='background-color:RGB(254, 255, 254); text-align: center;'>0.2</td>
</tr>
<tr>
<td style='text-align: left;'>Tunisia</td>
<td style='background-color:RGB(185, 255, 185); text-align: center;'>27.3</td>
<td style='background-color:RGB(235, 255, 235); text-align: center;'>7.9</td>
<td style='background-color:RGB(248, 255, 248); text-align: center;'>2.9</td>
<td style='background-color:RGB(253, 255, 253); text-align: center;'>0.7</td>
<td style='background-color:RGB(255, 255, 255); text-align: center;'>0.1</td>
</tr>
<tr>
<td style='text-align: left;'>Costa Rica</td>
<td style='background-color:RGB(190, 255, 190); text-align: center;'>25.3</td>
<td style='background-color:RGB(233, 255, 233); text-align: center;'>8.8</td>
<td style='background-color:RGB(249, 255, 249); text-align: center;'>2.5</td>
<td style='background-color:RGB(253, 255, 253); text-align: center;'>0.7</td>
<td style='background-color:RGB(255, 255, 255); text-align: center;'>0.1</td>
</tr>
<tr>
<td style='text-align: left;'>Canada</td>
<td style='background-color:RGB(182, 255, 182); text-align: center;'>28.7</td>
<td style='background-color:RGB(233, 255, 233); text-align: center;'>8.6</td>
<td style='background-color:RGB(249, 255, 249); text-align: center;'>2.2</td>
<td style='background-color:RGB(253, 255, 253); text-align: center;'>0.6</td>
<td style='background-color:RGB(255, 255, 255); text-align: center;'>0.1</td>
</tr>
<tr>
<td style='text-align: left;'>Saudi Arabia</td>
<td style='background-color:RGB(199, 255, 199); text-align: center;'>22</td>
<td style='background-color:RGB(241, 255, 241); text-align: center;'>5.4</td>
<td style='background-color:RGB(251, 255, 251); text-align: center;'>1.5</td>
<td style='background-color:RGB(254, 255, 254); text-align: center;'>0.3</td>
<td style='background-color:RGB(255, 255, 255); text-align: center;'>0</td>
</tr>
<tr>
<td style='text-align: left;'>Qatar</td>
<td style='background-color:RGB(207, 255, 207); text-align: center;'>19</td>
<td style='background-color:RGB(243, 255, 243); text-align: center;'>4.7</td>
<td style='background-color:RGB(252, 255, 252); text-align: center;'>1</td>
<td style='background-color:RGB(254, 255, 254); text-align: center;'>0.2</td>
<td style='background-color:RGB(255, 255, 255); text-align: center;'>0</td>
</tr>
<tr>
<td style='text-align: left;'>Cameroon</td>
<td style='background-color:RGB(221, 255, 221); text-align: center;'>13.5</td>
<td style='background-color:RGB(247, 255, 247); text-align: center;'>3.1</td>
<td style='background-color:RGB(253, 255, 253); text-align: center;'>0.6</td>
<td style='background-color:RGB(255, 255, 255); text-align: center;'>0.1</td>
<td style='background-color:RGB(255, 255, 255); text-align: center;'>0</td>
</tr>
<tr>
<td style='border-bottom: 2px solid grey; text-align: left;'>Ghana</td>
<td style='background-color:RGB(220, 255, 220); border-bottom: 2px solid grey; text-align: center;'>13.7</td>
<td style='background-color:RGB(250, 255, 250); border-bottom: 2px solid grey; text-align: center;'>2.1</td>
<td style='background-color:RGB(254, 255, 254); border-bottom: 2px solid grey; text-align: center;'>0.4</td>
<td style='background-color:RGB(255, 255, 255); border-bottom: 2px solid grey; text-align: center;'>0.1</td>
<td style='background-color:RGB(255, 255, 255); border-bottom: 2px solid grey; text-align: center;'>0</td>
</tr>
</tbody>
</table>

Except for reaching the last 16, I simply took the top 8/4/2/1 for the respective predictions in the contest.

Multiplying points by probabilities, my expected score so far is roughly 26.6 (though naturally with a lot of uncertainty either way), out of a total possible score of 63. That doesn't sound too great, but my expectation is that given the overall unpredictability, most other contestants won't have a high expected score either.

Of course, this expectation is conditional on the probabilities being correct - and there's a good chance they aren't and that there are at least sum issues in the elo rankings. Hopefully however these errors average out, keeping the above expectation intact.

Since a lot of events are rare, this expected value is probably on the high side - it's more likely below this than above it.

## Extras

The Essex contest also asked some other questions. Namely:

- Top Goal Scorer (2 pts)
- Number of goals scored by top (bonus 1pt)
- Number of red cards (tie breaker)
- Whether the correlation between group stage points will be (2pts):
  - Positive and statistically significant
  - Positive and statistically insigificant
  - Negative and statistically significant
  - Negative and statistically insignificant

For the first one, the best betting odds are on Harry Kane, who was also the last world cup's top scorer. I therefore put him, with 6 goals - the same as the previous world cup.

I also used the same number of red cards from the previous world cup: 4.

Finally, for the last question I found a report from 2010 indicating that for that world cup this was positive and statistically significant[^5]. So that was my answer.

## Conclusion

I learned a lot putting together this elo system. Both some really interesting things about elo rankings, and some other things about football.

Hopefully these predictions do okay. At some point, I may try and find some other predictions to compare them against with Brier scores. Until then, best of luck to the other contestants!


## Footnotes

[^1]: Football matches dataset: <https://www.kaggle.com/datasets/martj42/international-football-results-from-1872-to-2017>
[^2]: Fixture dates website: <https://fixturedownload.com/>
[^3]: Elo Ratings website: <http://eloratings.net/about>
[^4]: Blog post by Edouard Mathieu implementing a similar project for 2018, using the `elo` R package: <https://edomt.github.io/Elo-R-WorldCup/>
[^5]: PDF page 5/report page 3, if you're interested: <https://www.pwc.com/gx/en/issues/economy/global-economy-watch/assets/pdfs/global-economy-watch-june-2014-how-to-win-the-world-cup.pdf>