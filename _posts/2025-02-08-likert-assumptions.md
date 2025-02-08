---
layout: post
title: There is No Assumption-Free Way to Use Likert scales
tag: Political Methodology
---

In the social sciences, we are often interested in measuring _latent_ variables. Latent variables are defined by being latent, or unobserved. There is almost never a direct way of observing them. Psychological variables such as personality (the big 5) or depression are good examples. We can never directly observe these things - but we can observe _indicators_ of them.

An indicator outside of a social scientific setting might be the distinctive quirks in the behaviour of someone you know, or the way they tell you they've been feeling recently. These aren't the _thing_ in itself, but they _indicate_ the underlying thing. An effective means of measuring latent variables is therefore to collect several indicators, and aggregate over them in a meaningful way.

### Likert scales

In the social scientific setting, we rely on survey data to measurface is how to measure these concepts interest when they are attributes of individuals. A popular way of doing this is the _Likert scale_. In a Likert scale, survey respondents are given a number of questions to respond to, typically with a set of responses ranging from "strongly disagree" to "strongly agree" (precise wording varies).

Researchers assign numbers to these (e.g. 0 = "strongly disagree", 4 = "strongly agree") and aggregate them in some way (e.g. take the mean). If some of the statements are worded in one direction and some in the opposite direction (e.g. some are left wing, some are right wing), then the statements for one direction will be coded in the reverse direction (e.g. for left-wing statements set 0 = "strongly agree", 4 = "strongly disagree"). The output scale of the aggregation is a Likert scale[^1].

My argument in this blog post is that this process is heavily assumption-laden, and hides many challenges which are frequently ignored by the researchers using these scales in this way.

### Challenges

Surveys are expensive to conduct,  so it is often desirable to use a small number of indicators (6 seems to be considered a good number) to measure a given concept. This introduces a _selection_ problem: which indicators should be chosen for a given concept? Consider the example of left-right economic views. Do you want to focus on more abstract questions, such as on redistribution? More policy-oriented questions, such as whether taxes should go up or down? It is not easy to select such a small number of indicators which capture a given concept in full.

There is often talk of 'researcher degrees of freedom', but I think this is one of the most important yet neglected ways in which the subjective perspective of a given researcher or researcher can wind up influencing the discipline. For the aforementioned reason of resource availability we are generally dependent on 'off the shelf' survey datasets. While many of these are often of very high quality, it means that particular measures often get 'locked in' and left unscrutinised in downstream studies.

Related to the selection problem is the fact that not all indicators equally indicate an underlying concept. Making this harder still is the fact that it won't always be obvious a priori which indicators more strongly indicate an underlying concept. In the most popular measure of left-right views used in British political science, one of the questions asks "Management will always try to get the better of employees if it gets the chance", while another asks "Government should redistribute income from the better of to those who are less well of".

It seems likely that the latter will better capture left-right than the former, because people have relationships with their managers separate from their own beliefs[^2]. But we don't _know_ that this is true without evidence, any more than we can _know_ they are the same without evidence. If we had a larger number of indicators, we could probably assume that any error from aggregation of unequal indicators would average out. However, when working with a small number of indicators, this is probably no longer true.

Finally, survey design brings several challenges of its own. Survey respondents often _satisfice_, which is to say they find ways to make responding to a survey question easier. Always answering "neither agree nor disagree" no matter the content of the statement is one version of satisficing (and impossible to distinguish, without other information, from someone who genuinely feels that way about all the statements).

_Acquiescence bias_ in particular is a bias towards agreement regardless of the content of the statement. I've published a paper on this problem in the past[^3], and plan to eventually write a substack on it, so for now I will neglect this specific problem. Suffice to say: sometimes patterns of survey responses are artifacts of the data collection process, rather than of the underlying concept we actually care about. This is a real threat to both descriptive and causal inference. 


### The Common Factor Model

We can see these problems more clearly by using the _common factor model_. This is a mathematical model which points from latent variables, or factors, to observed indicators.

$$ x_{ij} = \lambda_{1j} \eta_{i1} + \cdots + \lambda_{mj} \eta_{im} + \epsilon_{ij}  $$

Here, \\(x_{ij}\\) is survey respondent \\(i\\)'s response to the \\(j\\)th indicator. \\(\eta_{im}\\) is respondent \\(i\\)'s position on the \\(m\\)th latent factor, while \\(\lambda_{mj}\\) is the _loading_ of the \\(m\\)th latent factor on indicator \\(j\\). A loading is similar to a parameter showing the effect of a variable on the outcome in OLS, except here we observe the outcome but not the independent variables (factors). \\(\epsilon_{ij}\\) is the unique factor for respondent \\(i\\), comparable in OLS to the error term.

In practice, we typically have less factors than observed indicators. An example might that a left-right factor and a measurement factor (such as for acquiescence bias) underlying several observed indicators of left-right belief. For the rest of this post, I'm going to ignore the measurement factors and focus on problems arising solely from the content factor of interest (such as left-right belief).

For simplicity, I've also abstracted away here from the fact that the responses to the questions used in aggregating up to Likert scales are ordinal, which necessitates the existence of things like thresholds between the levels of responses.

### Making Assumptions Explicit

When simply aggregating a collection of indicators by taking their mean, the implicit assumption is that for all \\(J\\) indicators, the loading of the factor on that indicator is equal. That is to say, if you construct our Likert scale in this way:

$$ y_{i} = \frac{1}{J} \sum_{j=1}^{J} x_{ij} $$

Then you are implicitly assuming that the loading from your single content factor \\(\eta_i\\) is equal for all observed indicators. That, is, for every pair of indicators \\(x_{ij},x_{ik}\\) the following is true of the factor model underlying your data:

$$ \forall j,k \in \{1,2,\cdots,J\} ~~~ \lambda_j = \lambda_k $$

This assumption is implicit because when you average over the indicators in the way you have above, you have placed equal weight on all observed indicators. Consider the following adjustment to the sum:

$$ y_{i} = \frac{1}{J} \sum_{j=1}^{J} w_j x_{ij} $$

Here, \\(w_j\\) is a _weight_ on the \\(j\\)th indicator. We should want this to be larger when \\(\lambda_j\\) is larger, and smaller when it is smaller, because this reflects how well the indicator captures the concept of interest \\(\eta_i\\). When simply taking the mean, this is equivalent to setting \\(w_j\\) to 1 for all indicators:

$$ \forall j \in \{1,2,\cdots,J\} ~~~ w_j = 1 $$

### What Should Researchers Do?

I think there are a couple of options facing researchers when using off-the-shelf Likert scales. A first option - and I stress a completely legitimate one - is to use the Likert scale anyway, but to be explicit rather than implicit about the assumptions behind this decision. Many measures go through a long process of development (the aforementioned popular British measure of left-right has at least 3 papers covering its development). In some cases, the developers of a scale may have provided good evidence that this assumption is approximately true.

Another option, and my preferred one, is to use some kind of scaling method. PCA, factor analysis (either exploratory factor analysis or confirmatory factor analysis), and item response theory (IRT) are all good options for measurement models. Instead of making assumptions on the shared content of the indicators, you can model it as a researcher and extract the predicted factor scores.

These methods are sometimes criticsed for producing difficult to interpret data, but I think this is unfair. The factor scores do not have a representational unit of measurement (e.g. degrees kelvin is a representation of temperature), but neither do the survey items. The simpler reason they are considered difficult to interpert I think is that reserachers using survey data are not always familiar with these methods. A measure based on taking the mean of several indicators is _simpler_, but that is not the same thing as being more easily _interpretable_.

Finally - other question formats exist. Many off-the-shelf surveys also contain perceptual 0-10 scales, where respondents select between two poles. These too have forms of satisficing, and choice of the poles matters - but they do not necessarily suffer from the aggregation problem of Likert scales (and, where measurement is concerned, do not have the upward bias of Likert scales from acquiescence bias).

---

## Footnotes

[^1]: Sometimes in the literature, the agree-disagree response is the Likert scale, and sometimes it's the aggregated output scale. For my purposes here, it's the latter.
[^2]: In fact, I know that this is the case. See tables D3 through to D6 in the supplementary material in my paper cited in the next footnote (you will likely need to read the paper to get the full context of these - sorry. Suffice to say the loading for 'lr5' is typically smaller than 'lr1' in most models).
[^3]: Swatton, P. (2024) Agree to agree: correcting acquiescence bias in the case of fully unbalanced scales with application to UK measurements of political beliefs, _Quality and Quantity_ 58. DOI: <https://doi.org/10.1007/s11135-024-01891-0>