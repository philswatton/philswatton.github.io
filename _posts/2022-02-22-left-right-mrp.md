---
layout: post
title: Left-Right Placements of GB Westminster Constituencies in 2021
css: page.css
---

For the first blog post on my website, I thought it would be interesting to demonstrate some of the MRP results from my own research. In this case, I ran an MRP model to estimate average left-right opinion in all of the Westminster parliamentary constituencies in Great Britain.

## MRP

For those who are new to the world of survey research, MRP stands for Multilevel Regression with Poststratification. The 'R' - regression- in MRP is the first part most statistics students will learn about, and is a quantitative research method where the associations between some dependent variable of interest (in this case a measure of left-right ideology) and several independent variables can be discovered. These assocations can be used in both explanatory and predictive contexts.

The 'M' - multilevel - is simply a specific form of regression modelling - sometimes known as hierarchical or random effects modelling. Formally, something modelled as a random effect is modelled as an error term. The specific use in MRP is that modelling a variable in this way allows for 'partial pooling', which utilises information across groups[^1][^2]. This is essential, as without it the number of combined groups across the data are often too high to allow for efficient use of information.

Finally, the 'P' - poststratification - will be the bit least familiar to researchers unaccustomed to survey research. Before delving into poststratification, it's helpful to start by explaining what stratification is. Stratification is a form of survey sampling where the population are divided into 'strata'. A stratum is essentially all the (relevant) combined features of a member of that population. So, if we're interested in sampling by age (split into young and old) and gender (split into female and male), we would have four groups - young female, young male, old female, and old male. Sampling would then be conducted from these groups. *Poststratification* by constrast deals with the problem of stratification after the fact by generating survey weights with respect to known values for the strata.[^3]

With MRP, the multilevel regression and the poststratification bits are put together. The first step in performing MRP is building a 'population frame', which is the combinations of the relevant variables in the population. The second step is running a multilevel model, where the same variables are used as predictors for the dependent variable of interest. The assocations from the model are used to predict the 'average' value for every row in the population frame. From here, the numbers in the population can be used to calculate overall averages. If the population frame includes lower geographies such as parliamentary constituencies - we can estimate average opinion in these constituencies.

## Model

In this section, I'll briefly outline the key information about my MRP model and what data I used. The code and results are all publicly available on my github in a dedicated repository which you can find [at this link](https://github.com/philswatton/mrpLR). The repository also includes a breakdown of data sources in the README file.

### Building the Population Frame

In the case of the UK, there's no freely available dataset that will work for predicting constituency opinion. This is because the publicly available census data doesn't contain a constituency variable. So, it becomes necessary to build a population frame. The process of building these frames remains in my opinion one of the major roadblocks to broader accessibility and application of MRP as a method. To build my population frame, I used 2011 census data from England, Scotland, and Wales. A better source would likely have been the Annual Population Survey, but so far the 2011 census has proven fairly reliable (and so I haven't yet felt the need to redo the work using the APS).

To turn the census data into the 'joint distribution' of the population frame, I used a method for building survey weights called raking. This takes what's called a 'marginal distribution', which contains the percentage of the population in a given category (e.g. the percentage of young people in a constituency) but not the percentages for joint categories (e.g. the percentage of young women) and creates survey weights with respect to it. Since we have access to the constituency marginal distirbutions for the 2011 census, it's possible to build a set of weights for the available census data based on this constituency data. I therefore did exactly this using the ANES raking algorithm[^4], using the weights to create weighted tables of counts for each stratum within each constituency.

One of the things making this step so inaccessible is the fact it can be fairly computationally intensive. The raking algorithm can be fairly slow-going, and even running it on the University of Essex's high performance computing cluster the process took several hours. Nonetheless, I hope that by making my frame publicly available, I'll have contributed a little bit to making MRP more accessible.

### Model Data

For the actual multilevel model, I used wave 21 of the BES internet panel[^5]. This dataset was collected in May 2021 and importantly contains both measures of left-right opinion and the same demographic variables available in the census. A major advantage of MRP models is their ability to include constituency data[^6] (and models with constituency data tend to perform better[^7]), so I included constituency-level data from the BES constituency data file[^8] (from which I also obtained the marginal distributions).

### Variables

Since in this case I want to predict left-right opinion, I used self-placements along a 0-10 scale from the BES. The problem with this kind of scale is they tend to be prone to two kinds of problem. The first is that you get something called differential item functioning (DIF). DIF is a form of response bias where different people perceive the same scale in different ways and respond accordingly. The second is rationalization bias, which is a form of bias where people will shift the placements of parties in response to their own placements and preferences. So a Labour supporter might place the Labour party as more centrist than it is and the Tories as more right-wing than they are.

To correct for this, I used Aldrich-McKelvey scaling[^9] to rescale the data with respect to respondent placements of political parties. This is one of the best approaches to correcting for DIF available and is also fairly robust to rationalization bias[^10]. If I had had more time, I would have used Bayesian Aldrich-McKelvey scaling which allows for the retention of respondents who haven't placed all the parties[^11], or one of its variants in the form of Intercept-Stretch-Rationalization which performs better in handling rationalization bias[^10].

Ignoring some outliers, the resulting left-right scale goes from about -2 (left) to 2 (right) at its most extreme. In practice, over 95% of respondents are in the roughly -1 to 1 range and over 50% are in the -0.5 to 0.5 range. It is worth noting that this is an interval scale, so the 0 point is arbitrary - it shouldn't be seen as the exact point of the political center.

For the individual-level independent variables in the MRP model, I included age (10 categories), National Statistics Socio-Economic Classification (8 categories), gender (2 categories), educational qualifications (5 categories), homeownesrhip (2 categories), ethnicity (5 categories), and parliamentary constituency (632 categories). That's 8,000 unique categories without parliamentary constituency, and 5,056,000 with. I further included several constituency-level independent variables which were party vote shares from the 2019 election (excluding Labour, the Brexit party, and UKIP), Chris Hanretty's estimates of constituency remain support in the 2016 EU referendum[^12], population density, the unemployment rate, the percentage of people employed in manufacturing work, and the percentage of people in the constituency who are white. These are chosen partly based on those constituency variables in Chris Hanretty's introduction to MRP[^6].

## Results

I was fairly torn on how to present the results from the model, but I've settled on presenting the most extreme constituences in tables and an interactive map of all placements.

<h3 style="align-self: center;">Top 10 Left-Wing</h3>

<table style="width:70%; align-self:center;">
 <thead>
  <tr>
   <th style="text-align:left;"> Constituency </th>
   <th style="text-align:center;"> Left-Right </th>
   <th style="text-align:left;"> 2019 Winner </th>
  </tr>
 </thead>
<tbody>
  <tr>
   <td style="text-align:left;"> Brighton, Pavilion </td>
   <td style="text-align:center;"> -0.380 </td>
   <td style="text-align:left;"> Green </td>
  </tr>
  <tr>
   <td style="text-align:left;"> Bristol West </td>
   <td style="text-align:center;"> -0.359 </td>
   <td style="text-align:left;"> Labour </td>
  </tr>
  <tr>
   <td style="text-align:left;"> Liverpool, Riverside </td>
   <td style="text-align:center;"> -0.328 </td>
   <td style="text-align:left;"> Labour </td>
  </tr>
  <tr>
   <td style="text-align:left;"> Glasgow North </td>
   <td style="text-align:center;"> -0.316 </td>
   <td style="text-align:left;"> Scottish National Party </td>
  </tr>
  <tr>
   <td style="text-align:left;"> Dulwich and West Norwood </td>
   <td style="text-align:center;"> -0.313 </td>
   <td style="text-align:left;"> Labour </td>
  </tr>
  <tr>
   <td style="text-align:left;"> Hackney South and Shoreditch </td>
   <td style="text-align:center;"> -0.283 </td>
   <td style="text-align:left;"> Labour </td>
  </tr>
  <tr>
   <td style="text-align:left;"> Hackney North and Stoke Newington </td>
   <td style="text-align:center;"> -0.281 </td>
   <td style="text-align:left;"> Labour </td>
  </tr>
  <tr>
   <td style="text-align:left;"> Glasgow Central </td>
   <td style="text-align:center;"> -0.259 </td>
   <td style="text-align:left;"> Scottish National Party </td>
  </tr>
  <tr>
   <td style="text-align:left;"> Glasgow North East </td>
   <td style="text-align:center;"> -0.258 </td>
   <td style="text-align:left;"> Scottish National Party </td>
  </tr>
  <tr>
   <td style="text-align:left;"> Glasgow North West </td>
   <td style="text-align:center;"> -0.257 </td>
   <td style="text-align:left;"> Scottish National Party </td>
  </tr>
</tbody>
</table>

<h3 style="align-self: center;">Top 10 Right-Wing</h3>

<table style="width:70%; align-self:center;">
 <thead>
  <tr>
   <th style="text-align:left;"> Constituency </th>
   <th style="text-align:center;"> Left-Right </th>
   <th style="text-align:left;"> 2019 Winner </th>
  </tr>
 </thead>
<tbody>
  <tr>
   <td style="text-align:left;"> Castle Point </td>
   <td style="text-align:center;"> 0.212 </td>
   <td style="text-align:left;"> Conservative </td>
  </tr>
  <tr>
   <td style="text-align:left;"> Rayleigh and Wickford </td>
   <td style="text-align:center;"> 0.171 </td>
   <td style="text-align:left;"> Conservative </td>
  </tr>
  <tr>
   <td style="text-align:left;"> Boston and Skegness </td>
   <td style="text-align:center;"> 0.166 </td>
   <td style="text-align:left;"> Conservative </td>
  </tr>
  <tr>
   <td style="text-align:left;"> South Holland and The Deepings </td>
   <td style="text-align:center;"> 0.165 </td>
   <td style="text-align:left;"> Conservative </td>
  </tr>
  <tr>
   <td style="text-align:left;"> Clacton </td>
   <td style="text-align:center;"> 0.150 </td>
   <td style="text-align:left;"> Conservative </td>
  </tr>
  <tr>
   <td style="text-align:left;"> Louth and Horncastle </td>
   <td style="text-align:center;"> 0.145 </td>
   <td style="text-align:left;"> Conservative </td>
  </tr>
  <tr>
   <td style="text-align:left;"> Romford </td>
   <td style="text-align:center;"> 0.145 </td>
   <td style="text-align:left;"> Conservative </td>
  </tr>
  <tr>
   <td style="text-align:left;"> Christchurch </td>
   <td style="text-align:center;"> 0.133 </td>
   <td style="text-align:left;"> Conservative </td>
  </tr>
  <tr>
   <td style="text-align:left;"> North East Cambridgeshire </td>
   <td style="text-align:center;"> 0.131 </td>
   <td style="text-align:left;"> Conservative </td>
  </tr>
  <tr>
   <td style="text-align:left;"> Aldridge-Brownhills </td>
   <td style="text-align:center;"> 0.130 </td>
   <td style="text-align:left;"> Conservative </td>
  </tr>
</tbody>
</table>

The most striking from the more extreme results is how strongly they correspond to the vote shares of the parties. This isn't entirely surprsing given their inclusion in the model - the predictions generated will be in no small part a function of these vote shares. Nonetheless, this does also give the results a good degree of face validity: it makes sense that the constituencies with the largest Conservative vote share are the most right-wing. It also makes sense that Brighton as the only place to elect a Green MP is the most left-wing. Full results with all the numbers are available in the github repository linked above in both RDS and CSV formats.

### Map

Probably of broader interests is this map of GB parliamentary constituencies. If you hover over the hexes, you'll see the name of the constituency, its region, the winning party in 2019, and its left-right score as predicted by the MRP model. A fair warning here in that I suspect this is likely to display much better (and be much more useable) on PC rather than mobile. I also can't necessarily guarantee that it will work well outside of Chrome (though please do let me know if not).

Broadly, the more red a constituency is the more left-wing it is and the more blue a constituency is the more right-wing it is. The colours are assigned based on the range of the scale and correspond to left-right, but since the most left-wing constituency has a larger absolute value, '0' isn't the exact middle of the scale and the white colour doesn't exactly correspond to this. I stuck with this because of the aforementioned arbitaryness of the 0 point - instead these colours show how relatively left/right the constituencies are with respect to each other. 

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
[^12]: <https://www.tandfonline.com/doi/full/10.1080/17457289.2017.1287081>