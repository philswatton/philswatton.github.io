---
layout: post
author: Phil Swatton
css: sitepage.css
usemath: true
---

As they will doubtless inform any reader who cares to ask, one misforunte that occasionally befalls some of my PhD colleagues is to be compelled to induldge my passion for arguing against the use of Fixed Effects (FE) models as a default. Naturally, it did not take long for some of Professor Wooldridge's [recent](https://twitter.com/jmwooldridge/status/1400133254859177988) [twitter](https://twitter.com/jmwooldridge/status/1400273032510386177) [threads](https://twitter.com/jmwooldridge/status/1400287068006367232) to be [sent](https://twitter.com/jmwooldridge/status/1400454795014541319) my way.

I've often tried to argue against FE models *as a default* to some of my colleagues, but these recent tweets offer a good opportunity to try and write these arguments up and test them against the wider world. Naturally Professor Wooldridge knows a great deal more than I do about these models and I don't presume otherwise. I do however feel I know *enough* to make this argument while the iron's still hot after his tweets on the topic.

The main purposes of this post are then to help my clarify my own thoughts on the matter and have something written up for when I need (want) to discuss the topic in future. It also serves as a way of launching a blog on my website - something probably sorely needed given I haven't really put much of my work out into the world thus far.

I'll begin by briefly defining what is meant by FE and Random Effects (RE) models (an important step given as [this Stackexchange answer](https://stats.stackexchange.com/a/4702/308607) shows, there are at least five definitions). From here, I'll briefly outline as best I can the reason why many econometricians argue in favour of FE models as a default, before turning to explaining why I think this really shouldn't be the case.

## Defining FE and RE

It's useful to begin a discussion of the relative merits with a bogstandard panel/time-series cross-sectional data set up (henceforth just panel data for the sake of simplicity). In particular, it's even more useful to discuss this by beginning with a solution that everyone agrees is crap for dealing with the modelling problems introduced by this style of dataset. While the focus will then be on datasets where the same unit (individuals, parties, countries, etc - pick your poison) is observed over time, the discussion here will apply equally to any situation where there is some kind of hierarchy in your data - e.g. individuals nested in countries.

The OLS model in this situation could be written as such:

{% raw %}
$$ y_{it} = \beta_0 + \beta_1x_{it} + e_{it} $$
{% endraw %}

Where \\(i\\) is the subscript for unit i, \\(t\\) is the subscript for time period t, \\(y_{it}\\) is the dependent variable for unit i in time period t, \\(x_{it}\\) is the independent variable for unit i in time period t, and \\(e_{it}\\) is the error term for unit i in time period t. \\(\beta_0\\) is the intercept and \\(\beta_1\\) is the effect of \\(x_{it}\\) on \\(y_{it}\\).

One problem with the OLS model in this situation that the assumption that data are independentply and identically distributed <!--(iid)-->is violated. The data are *clustered* - observations belonging to unit i are more similar to one another than other observations by merit of beloning to unit i. In this scenario, the standard errors of the OLS model will be too small and the probability of a type 1 error will increase.

Consequently, we need a solution that allows us to handle the clustered nature of the data.

FE models are one such solution. The fact I am appending 'models' to the end of this is delibrate. One problem in the literature on FE and RE models is that the terminology becomes fairly confusing. In the RE (also multievel, mixed, hierachical models - see?) literature, Fixed Effects are simply effects which are not estimated as random components - which means that e.g. your bogstandard \\(\beta_1\\) would be a fixed effect under this definition. This is probably a bit of an oversimplificaiton of what is sometimes meant by FE but hopefully will help at least some readers avoid potential confusion in other places.

In FE models, the clustered nature of the data is dealth with by adding fixed effects. For the purpose of this blog post I will deal only with unit FEs and REs, but the point generalises to other kinds of FEs and REs without problem. So, the unit FE model would be:

{% raw %}
$$ y_{it} = \beta_0 + \beta_1x_{it} + C_i + e_{it} $$
{% endraw %}

Where \\(C_i\\) is the unit dummy (and corresponding coefficient). This particular expression of the model is fine but can mislead as to what's going on: another expression of the same model is written by subtracting everything from the corresponding unit-mean:

{% raw %}
$$ (y_{it} - \bar{y_i}) = \beta_1(x_{it} - \bar{x_i}) + (e_{it} - \bar{e_i}) $$
{% endraw %}

It's well-known that the \\(\beta_1\\) in both equations are equivalent. The way that FE models work is *not* by controlling for unobserved unit level heterogeneity (as is sometimes assumed - see the next section for discussion of this), but rather it removes time-invariant unit-variation *completely*. What's left over here is *within-unit* effects on *within-unit* variation in the dependent variable.

The random effects solution is less drastic. Instead of removing the level of variation about which we are worried entirely,

{% raw %}
$$ y_{it} = \beta_0 + \beta_1x_{it} + C_i + e_{it} $$
{% endraw %}

## Wooldridge's argument:

FE deals with endogeneity, RE assumes exogeneity

Hausman is best treated as telling us how guilty we should feel about using RE - it defintely doesn't tell us to use it

## My argument:



RE can be specified to deal with endogeneity from level-2 covariates/effects

## What I'm uncertain about

- not clear to me how robust RE is to other violations - e.g. normality - though Bell & Jones say it is (I imagine there's probably a more comprehensive review out there but I haven't had time to search for it)

## Footnotes

[^1]: Bell, A. and Jones, K. (2015) Explaining Fixed Effects: Random Effects Modeling of Time-Series Cross-Sectional and Panel Data, *Political Science Research and Methods* 3 (1), p. 133-153. DOI: [https://doi.org/10.1017/psrm.2014.7](https://doi.org/10.1017/psrm.2014.7)