---
layout: post
title: Left-Right Placements of GB Westminster Constituencies in 2021
css: page.css
---

For the first blog post on my website, I thought it would be interesting to demonstrate some of the MRP results from my own research. In this case, I ran an MRP model to estimate average left-right opinion in all of the Westminster parliamentary constituencies in Great Britain.

## MRP

For those who are new to the world of survey research, MRP stands for multilevel regression with poststratification. The 'R' in MRP is the first part most statistics students will learn about, and is a quantitative research method where the associations between some dependent variable of interest (in this case a measure of left-right ideology) and several independent variables can be discovered. These assocations can be used in both explanatory and predictive contexts.

The 'M' - multilevel modelling - is simply a specific form of regression modelling - sometimes known as hierarchical or random effects modelling. Formally, something modelled as a random effect is modelled as an error term. The specific use in MRP is that modelling a variable in this way allows for 'partial pooling', which utilises information across groups[^1][^2]. This is essential, as without it the number of combined groups across the data are often too high to allow for efficient use of information.

Finally, the 'P' will be the bit least familiar to researchers unaccustomed to survey research. Stratification is a form of survey sampling where the population are divided into 'strata'. A stratum is essentially all the (relevant) combined features of a member of that population. So, if we're interested in sampling by age (split into young and old) and gender (split into female and male), we would have four groups - young female, young male, old female, and old male. Sampling would then be conducted from these groups. *Poststratification* by constrast deals with the problem of stratification after the fact by generating survey weights with respect to known values for the strata.[^3]

With MRP, the multilevel regression and the poststratification bits are put together. The first step in performing MPR is building a 'population frame', which is the combinations of the relevant variables in the population. The second step is running a multilevel model, where the same variables are used as predictors for the dependent variable of interest. The assocations from the model are used to predict the 'average' value for every row in the population frame. From here, the numbers in the population can be used to calculate overall averages. If the population frame includes lower geographies such as parliamentary constituencies - we can estimate average opinion in these constituencies.

## Model

In this section, I'll briefly outline the key information about my MRP model and what data I used. The code and results are all publicly available on my github in a dedicated repository which you can find [at this link](https://github.com/philswatton/mrpLR). The repository also includes a breakdown of data sources in the README file.

### Building the Population Frame

In the case of the UK, there's no freely available dataset that will work for predicting constituency opinion. This is because the publicly available census data doesn't contain a constituency variable. So, it becomes necessary to build a population frame. The process of building these frames remains in my opinion one of the major roadblocks to broader accessibility and application of MRP as a method. To build my population frame, I used 2011 census data from England, Scotland, and Wales. A better source would likely have been the 2016 Annual Population survey data, but so far the 2011 census has proven fairly reliable (and has saved me from needing to redo the work on the APS survey).

To turn the census data into the 'join distribution' of the population frame, I used a method for building survey weights called raking. This takes what's called a 'marginal distribution', which contains the percentage of the population in a given category (e.g. the percentage of young people in a constituency) but not the percentages for joint categories (e.g. the percentage of young women) and creates survey weights for it. Since we have access to the constituency marginal distirbutions for the 2011 census, it's possible to build a set of weights for the available census data based on this constituency data. I therefore did exactly this using the ANES raking algorithm[^4], using the weights to create weighted tables of counts for each stratum within each constituency.

### Model Data

For the actualy multilevel model, I used wave 21 of the BES internet panel[^5]. This dataset was collected in May 2021 and importantly contains both measures of left-right opinion and the same demographic variables available in the census. A major advantage of MRP models is their ability to include constituency data[^6] (and models with constituency data tend to perform better[^7]), so I included constituency-level data from the BES constituency data file[^8] (from which I also obtained the marginal distributions).

### Variables

Since in this case I want to predict left-right opinion, I used self-placements along a 0-10 scale from the BES. The problem with this kind of scale is they tend to be prone to two kinds of problem. The first is that you get something called differential item functioning (DIF). DIF is a form of response bias where different people perceive the same scale in different ways and respond accordingly. The second is rationalization bias, which is a form of bias where people will shift the placements of parties in response to their own placements and preferences. So a Labour supporter might place the Labour party as more centrist than it is and the Tories as more right-wing than they are.

To correct for this, I used Aldrich-McKelvey scaling[^9] to rescale the data with respect to respondent placements of political parties. This is one of the best approaches to correcting for DIF available and is also fairly robust to rationalization bias[^10]. If I had had more time and inclination, I might have used Bayesian Aldrich-McKelvey scaling which allows for the retention of respondents who haven't placed all the parties[^11], or one of its variants in the form of Intercept-Stretch-Rationalization which performs better in handling rationalization bias[^10].

Ignoring some outliers, the resulting left-right scale goes from about -2 (left) to 2 (right) at its most extreme. In practice, over 95% of respondents are in the roughly -1 to 1 range and over 50% are in the -0.5 to 0.5 range. It is worth noting that this is an interval scale, so the 0 point is arbitrary - it shouldn't be seen as the exact point of the political center.

For the independent variables in the MRP model, I included the following variables set out in the table:

TABLE GO HERE

## Results

Without further delay, I can present the tables of the ten most left-wing and right-wing constituencies:

TABLES GO HERE

BRIEF DISCUSSION HERE

### Map

Since I'm sure it will be of interest, I've also included an interactive map of GB parliamentary constituencies. If you hover over the hexes, you'll see the name of the constituency, its region, the winning party in 2019, and its left-right score as predicted by the MRP model. A fair warning here in that I suspect this is likely to display much better (and be much more useable) on PC/laptop rather than mobile. I also can't necessarily guarantee that it will work well outside of Chrome (though please do let me know if not).

<iframe src="/interactive/map.html" class="hex-gb"></iframe>

## Footnotes

[^1]: <http://citeseerx.ist.psu.edu/viewdoc/summary?doi=10.1.1.44.5270>
[^2]: <https://www.cambridge.org/core/journals/political-analysis/article/bayesian-multilevel-estimation-with-poststratification-statelevel-estimates-from-national-polls/22A5EF78D027E76C782B3280D400FCC9>
[^3]: <https://www.tandfonline.com/doi/abs/10.1080/01621459.1993.10476368>
[^4]: <https://cran.r-project.org/web/packages/anesrake/anesrake.pdf>
[^5]: <https://www.britishelectionstudy.com/data-objects/panel-study-data/>
[^6]: <https://journals.sagepub.com/doi/full/10.1177/1478929919864773>
[^7]: <https://www.sciencedirect.com/science/article/pii/S016920701930189X>
[^8]: <https://www.britishelectionstudy.com/data-objects/linked-data/>
[^9]: <https://www.cambridge.org/core/journals/american-political-science-review/article/abs/method-of-scaling-with-applications-to-the-1968-and-1972-presidential-elections/D5484A9333C1DF0CEC5E019638452493>
[^10]: <https://www.cambridge.org/core/journals/political-analysis/article/capturing-rationalization-bias-and-differential-item-functioning-a-unified-bayesian-scaling-approach/B5EA395887034A9E555BE78B1974CEF9>
[^11]: <https://onlinelibrary.wiley.com/doi/full/10.1111/ajps.12151>