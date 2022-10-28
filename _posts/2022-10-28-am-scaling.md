---
layout: post
title: Aldrich-McKelvey Scaling
subtitle: An Opinionated Guide to the Method and the Literature
categories: ["Political Methodology"]
---

Aldrich-McKelvey scaling (henceforth AM scaling) is a fairly niche method in political science. Developed by Aldrich and McKelvey in a 1977 paper[^1], as a method it isn't widely known or used in political science. This is partly because it's so application-specific. You could use it solely to measure the positions of political parties from mass surveys, but there are often better methods available. It's typically used as a means of obtaining measures of ideology for both political parties and respondents on the same scale. Even here, it's entirely dependent on the availability of ordered rating scales of both voter and party positions in the same survey.

Despite the fact that as a method it is so specific, I think it's a shame that the method isn't at least better known. It's incredibly useful, and instructive as an example of how we can do a lot better than just using raw survey data without taking the time to properly interpret or correct our results. It's also a good case study in how many data problems can often have very specific solutions - we don't always need to use general methods like item response theory or factor analysis (although these are great too!).

So, I have two motivations for this blog post. First, I want to do my part in promoting awareness, if not use, of AM scaling. Second, I want this blog post to act as the kind of tutorial I think I would have benefitted from when I was first learning about the method. There's an introduction in *Analyzing Spatial Models of Choice and Judgment*[^2], but this isn't easily available for everyone. So, there's a real gap for a guide like this one. I'll be giving my own take on things in places, but hopefully it's clear where something comes from the original paper, and where something is my own opinion.

In the rest of this blog post, I proceed in five steps. First, I set out in brief the problems that AM scaling solves. Second, I explain both the informal and formal assumptions behind the method. Third, I explain in brief how the AM solution is computed. Fourth, I discuss some of the developments in the interpretation of the AM results and some methodological develoments that followed the original method. Finally, I'll give a brief survey of the available implementations in R.

## The Problem

Political scientists want to measure political ideology. Political ideology is often an attribute of many things - of voters, of parties, of policy programmes.

Sometimes, we'll be interested in obtaining a measure of ideology that's valid for more than one of these at the same time, so we can make comparisons between them or relate them to each other on an ideological basis (e.g. spatial model of vote choice). AM scaling allows us to place political parties and voters on the same scale, so we can make ideological comparisons between them.

This is however actually a side-effect of the procedure. In the original paper, primary interest was in using survey respondent placements of political parties to estimate party position. In particular, Aldrich and McKelvey wanted to address the problem of *differential item functioning* (DIF).

DIF in short is a problem where for the same underlying perception, survey respondents will use a survey scale differently. This becomes a major issue in ordered rating scales, where we might ask respondents to place political parties on a numbered scale from far left (0) to far right (10). These also get used for other ideological scales, but I'll mostly be referring to the left-right example in this blog post.

A related problem is rationalization bias. This is more of a bias in the underlying perception, where respondents will percieve parties they like as further away from themselves and parties they like as closer to themselves. They may also be more likely to see themselves or parties they like as closer to the political center. However, AM scaling includes DIF explicitly, but only implicitly handles rationalization bias (see more discussion of this below).

In their paper, Aldrich and McKelvey develop an analytical solution for this problem, wherein we can extract party (and voter) postions corrected of DIF. They give a proof of the veracity of their method given certain assumptions. I won't explain the proof in this post, but I will explain the assumptions and give some thoughts on their implications.

Most of the math in this post will be familiar to anyone comfortable with OLS. The two components that might not be are the 'for all' symbol \\(\forall\\) and the notion of eigendecomposition. Eigendecomposion in brief is a matrix decomposition, which essentially breaks a matrix down into other matrices. For a square matrix \\(\boldsymbol{M}\\), an eigendecomposition can be given as

$$ \boldsymbol{Mv} = \lambda\boldsymbol{v} $$

where \\(\boldsymbol{v}\\) is the eigenvector and \\(\lambda\\) is the eigenvalue for \\(\boldsymbol{M}\\). The important thing to understand is that the eigenvalue preserves information from the matrix in a single number. Note that there are as many eigenvalues and vectors as there are columns/rows of \\(\boldsymbol{M}\\). These can also be represented fully with all of the eigenvectors in a matrix and all of the eigenvalues in a diagonal matrix.

## Assumptions

Aldrich and McKelvey make both informal and formal theoretical assumptions. Here I'll list out both, and comment on their implications where relevant.

### Informal:

- Political parties/elites (or whatever stimuli you're estimating a position for) have 'real' positions.
- There exist *random* disturbances in respondent perceptions of true position (from ambiguity, lack of information, selective retention of information, etc).
- Survey respondents will take perception they hold in their mind and linearly transform it to the survey scale, subject to the random error.

I think at this stage, some points are worth making. First, what a 'real' position actually means in practice is kind of ambiguous. Is ideology a real attribute, or just a useful summary of several other attributes (e.g. opinions on several policy issues)? I think political scientists will probably disagree somewhat as to the extent ideology is correctly interpreted, and that isn't in my view an obstacle to using AM scaling.


### Formal:

- There are \\(n\\) survey respondents indexed by \\(i\\).
- 'True' respondent positions are represented by \\(Y_{i0}\\) for respondent \\(i\\).
- There are \\(J\\) stimuli (e.g. political parties) indexed by \\(j\\).
- 'True' stimuli positions are represented by \\(Y_j\\) for stimulus \\(j\\).
- Assume \\(Y_j\\) to be normalised with unit sum of squares to set the scale:
  - \\(\sum_{j=1}^J Y_j = 0\\)
  - \\(\sum_{j=1}^J Y_j^2 = 1\\)
  - In practice, this means that the distribution of \\(Y_j\\) will be mean 0 and its standard deviation and variance is determined solely by the size of \\(J\\).
  - This isn't a meaningful statement about any true measure of ideological positions of the stimuli, but rather simply a way of setting the scale of the estimated positions.
- Respondent \\(i\\)'s preception of stimulus \\(j\\)'s location is given by \\(Y_{ij}\\).
- \\(Y_{ij}\\) is distributed randomly around \\(Y_j\\).
- The random error for respondent \\(i\\)'s preception of stimulus \\(j\\) is given by \\(u_{ij}\\), meaning that \\(Y_{ij} = Y_j + u_{ij}\\).
- \\(u_{ij}\\) satisfies gauss-markov assumptions.
  - Aldrich and McKelvey list three assumptions here:
    - \\(E[u_{ij}] = 0\\)
    - \\(E[u_{ij}]^2 = \sigma^2 \;\; \forall i,j\\)
    - \\(E[u_{ij}u_{kl}] = 0 \;\; \forall i \neq k, \; j \neq l \\)
  - Given their reference to Gauss-Markov assumptions, it's possible that the second and third assumptions should have been expressed as:
    - \\(Var(u_{ij}) = \sigma^2 \;\; \forall i,j\\) (i.e. homoskedastic errors)
    - \\(Cov(u_{ij}u_{kl}) = 0 \;\; \forall i \neq k, \; j \neq l \\)
    - But, given their later use of \\(\sigma^2\\) in the paper, there's a good chance I'm wrong on this point.
- The reported placement of stimulus \\(j\\) by respondent \\(i\\) is given by \\(X_{ij}\\).
- The reported self-placement of respondent \\(i\\) is given by \\(X_{i0}\\).
- If we set \\(c_i + w_iX_{ij} = Y_{ij}\\), then the relationship between \\(X_{ij}\\) and \\(Y_j\\) can by characerised by \\(c_i + w_iX_{ij} = Y_j + u_{ij}\\)
  - \\(c_i\\) and \\(w_i\\) are named the bias and weight parameters respectively. They map from the respondent's survey response to the scale set above for \\(Y_j\\).

As with methods like OLS, how important these assumptions are in practice can vary. Past research has shown that AM scaling is robust to heteroskedastic errors in respondent perceptions[^3].

## Estimation

With the above terms defined and assumptions made, Aldrich and McKelvey produce a proof for the following estimation procedure.

Begin by setting

$$ \boldsymbol{X}_{i} = \begin{bmatrix} 1 & X_{i1} \\ 1 & X_{i2} \\ \vdots & \vdots \\ 1 & X_{iJ} \end{bmatrix} $$

for each respondent. Then calculate

$$ \boldsymbol{A} = \sum_{i=1}^n{\boldsymbol{X}_{i}'(\boldsymbol{X}_{i}'\boldsymbol{X}_{i})^{-1}\boldsymbol{X}_{i}'} $$

Aldrich and McKelvey show that if we take the eigendecomposition of

$$ \boldsymbol{A} - n\boldsymbol{I} $$

where \\(I\\) is a \\(J\times J\\) indentity matrix, then the solution for \\(Y_j\\) is the eigenvector corresponding to the highest negative eigenvalue (i.e. the negative eigenvalue closest to 0). Th

The proof further shows that we can estimate the bias and weight parameters by regressing the estimated positions \\(\hat{Y}_j\\) on the respondent placements:

$$ \begin{bmatrix} c_i \\ w_i \end{bmatrix} = (\boldsymbol{X}_i'\boldsymbol{X}_i)^{-1}\boldsymbol{X}_i'\boldsymbol{\hat{Y}} $$

Note that this operation must be performed for each respondent individually. The recovered bias and weight paramters can in turn be applied to the respondents' self-placement on the same scale to recover a DIF-corrected positon for the respondents:

$$ \hat{Y}_{i0} = c_i + w_i X_{i0} $$

This completes the AM scaling procedure.


## Discussion

With the procedure set out, I want to discuss it a little further. I'll start by making some general points on the robustness of the model to rationalization bias. I'll then discuss developments on the original model, and conclude by discussing where I think future work might be interesting to do.

### Rationalization Bias

One of the most striking things about the original Aldrich and McKelvey paper is that they treat deviations in underlying perception as being essentially random. In the way they set out the model, the bias and weight paramters exist only to relate respondent placements to the latent scale.

But the question remains: what about rationalization bias? This is more systematic than random. We might expect AM scaling to fail once it encounters rationalization.

It turns out that simulation evidence suggests AM scaling is fairly robust to the presence of rationalization bias. A recent paper by Bølstad shows that it's good at recovering placements of stimuli under rationalization bias, though less good than more recent methods at recovering respondent placements under this condition[^4].

So, I think it's safe to treat \\(c_i\\) and \\(w_i\\) as not only relating \\(X_{ij}\\) to the latent scale, but also as capturing structural biases in respondent perceptions of stimuli. Still, rationalization bias is something to watch out for.

### Developments

This discussion brings me nicely into the realm of developments on AM scaling. Most new methodologies being developed from the original have been fairly recent.

Among more recent methods, the first was Bayesian Aldrich-McKelvey scaling[^5], developed by Hare *et al*. This method has two main advantages:

- First, Bayesian models can incorproate missing data as an additional parameter to be estimated. This means that unlike the original model, respondents with incomplete placements for stimuli can still be used for estimating stimuli positions and have their own placements estimated (self-placements are still required here).
- Bayesian estimation allows for natural estimation of uncertainty around stimuli positions (and respondent paramters) through use of the posterior distribution.

Bayesian AM scaling notably can be used in conjunction with 'anchoring vigenttes'[^6] in surveys. This allowed Bakker *et al* to scale placements of political parties from different countires in the Chapel Hill expert survey against each other[^7]. Crucial here is the treatment of missing placements as an additional parameter. There is no immediate reason why the same method couldn't work over time, or over both time and across countries simultaneously (and for mass surveys too!).

One note woth making on Bayesian AM scaling is it 'flips' the original model:

$$ X_{ij} = a_i + b_iY_j + u_{ij} $$

To be explicit, the parameters operate on the underlying position, instead of on the perception as in the original method. I think this arose largely due to the need to calculate the likelihood of the model based on \\(X_{ij}\\), but since then this formula has been used to describe AM scaling elsewhere. So, if you see AM scaling described in this way, or you see something suggesting respondent self-placements are calculated as

$$ Y_{i0} = \frac{X_{ij} - a_i}{b_i} $$

then know this is more accurate for Bayesian AM scaling. Whether this is a confusion, or is done to introduce Bayesian AM scaling, I don't know (and it probably varies depending on the document it's in) - but a large amount of existing material repeats this and so I think it's worth spelling out so other readers can avoid the same confusion I faced.

Since then, there have been two developments on Bayesian AM. The first is the Intercept-Stretch-Rationalization model by Bølstad, which explicitly includes an additional parameter for rationalization bias[^4]. I won't go into the details in this blog post, but it achieves this by including respondents' ratings of the parties in terms of how much they like them (or their propensity to vote scores).

I think this method is a real advance, but the one area I'm unsure in is how well it applies beyond the left-right scale. I say this because it expresses the like responses as a combination of spatial distance and how much the respondent likes the party on top of that. While that obviously works well for an aggregate, high-level scale like left-right, I don't know how important that conceptualisation is for lower-level scales (like say, specific attitudes on the environment or on the EU).

A work-in-progress of Bayesian AM scaling is ordered Bayesian AM scaling[^8] by McAlister *et al*. Here, the goal is to address the fact that strictly speaking, most ordered rating scales are ordinal and not ratio or interval. The main issue is how you treat the thresholds in this specification - it's not straightforward to try and estimate respondent-specific thresholds, and generally speaking it's on this point that development of ordered Bayesian AM rests.

Another older but related methodology is blackbox and blackbox transpose scaling[^9]. In short, these are methods to extract a smaller number of dimensions either from a matrix of respondent self-placements on several different dimensions, or stimuli placements on the same scale. This is again a sufficiently different method that I won't cover it in further detail in this blog post, beyond noting that unlike other developments this tends to address a subtly different problem to the original AM scaling procedure.

### Future Work

I think there's a lot of fruitful work to be done on AM scaling. A part of this is just better understanding the properties of the AM estimator. I've made my own small contribution to this, and have written a note showing how the minimum size for \\(J\\) is 3 and offering a new estimation method in one of my working papers[^10]. I still think there's a lot of work to do in better understanding the method though. One clear area would be coming up with a method for computing confidence intervals on the estimated positions of the stimuli (i.e. without just boostrapping them).

Beyond this, a fairly recent paper by Bølstad and Dians introduced the notion of categorisation theory to models of spatial vote choice[^11]. In short, people don't just vote based on ideological distance - more important is percieveing parties/elites as being on *the same side*. This also appears to play into rationalization bias. It follows that this is a clear avenue for development of the model.

Of course, the sky's really the limit here - one thing AM scaling shows is just how effective application-specific methods can be.

One thing I do think is that we can probably take parts of the AM scaling procedure and work with them. For example, there's nothing stopping us from using CHES (or other) placements as \\(\hat{Y}_j\\) and regressing respondent left-right placements (or other placements) on these. Likewise, while we definitely can't use respondents with missing placements to estimate \\(\hat{Y}_j\\), we could regress estimated positions on the placements respondents HAVE provided to avoid losing out on them as missing data during the AM process. In short, there's probably a lot that we could take from this procedure in terms of measuring respondent placements on the same scale as external stimuli that don't always require survey data.

## R Implementations

The only remaining thing to touch on in this blog post is how you can use AM scaling. To my knowledge, the only currently existing implementations are in R. I may get around to a Python implementation at some point, but you might beat me to it!

At present, the main workhorse package for AM scaling (and blackbox scaling) is the `basicspace` R package[^12]. AM scaling is implemented here as the `aldmck` function, which takes the following inputs:

```
aldmck(data, respondent = 0, missing = NULL, polarity, verbose = FALSE)
```

`data` should be a dataframe or matrix of placements. `respondent` if set to anything other than `0` declares which column respondent self-placements are in. `missing` if not `NULL` declares values (e.g. `11`) to be treated as missing by the function (you can include `NA`s - but see discussion below). `polarity` is an integer corresponding to the column of the stimuli you want to be on the 'left' side of the extracted scale - you HAVE to set this. All this does is 'flip' the results if the estimated position of that stimulus isn't already negative. `verbose` simply declares whether you want a print-out on the progress of the function.

Generally speaking, `basicspace` is the package you should be using for AM scaling. It's directly available via CRAN, reliable, and is fast. One note however is that the function behaves poorly with missing data - it seems to retain data that it shouldn't. For this reason, I'd advise that you manually filter missing data yourself before using the `aldmck` function. If you're interested in doing some open source coding, then in my own debugging I've worked out that the problem is in the FORTRAN code - hence I've been unable to solve it myself.

Partly because of this problem with missing data, and partly as practice, I produced my own implementation in my `psmisc`[^13] R package via the `amscale` function. At the time of writing this is implemented as:

```
amscale(x, resp = NULL, polarity = NULL)
```

where `x` is a dataframe or matrix of placements of stimuli positions, `resp` if provided is a vector of respondent self-placements, and `polarity` optionally performs the same operation as in the `basicspace` package.

At present, you'll find that `amscale` is much slower than `aldmck`. This is because I found a way to implement it without calculating the inversion of \\(\boldsymbol{X}_i'\boldsymbol{X}_i\\) in the calculation of \\(\boldsymbol{A}\\) [^10]. This has two advantages: it avoids losing respondents because this is not invertable, and may potentially be more numerically precise. In practice, I don't think it makes much different on the latter point. If you do choose to use my implementation, the package is available on github. A fair warning however is that it is fairly untested, and liable to be changed in the future as the package is in a very early stage of development.

In the long term, I'll probably implement the classical method and allow the user to choose. The advantage of using my function is that it will not lose respondents to this stage, and it will handle missing data correctly. But you are facing a speed loss, which will become especially problematic if you need to perform AM scaling on several samples.

## Conclusion

Hopefully, this blog post has covered the main bases of AM scaling for you: what it is, how it works, how to interpret it, where the literature is at, and how you can use it in R. I haven't covered all points, such as the proof of the solution - and I don't know all there is to know about it. But hopefully the footnotes below will provide a sufficiently extensive starting point for further reading should you be interested. I hope that AM scaling and other application-specific methods in political science do become better known and more widely used.

## Footnotes

[^1]: Original Aldrich-McKelvey Paper: <https://doi.org/10.2307/1956957>
[^2]: Analyzing Spatial Models of Choice and Judgment, second edition: <https://www.routledge.com/Analyzing-Spatial-Models-of-Choice-and-Judgment/Armstrong-Bakker-Carroll-Hare-Poole-Rosenthal/p/book/9781138715332>
[^3]: Robustness to heteroskedasticity, measuring information from the Aldrich-McKelvey solution: <https://doi.org/10.2307/2111281>
[^4]: Robustness to rationalization bias, Intercept-Stretch-Rationalization model: <https://doi.org/10.1017/pan.2019.42>
[^5]: Bayesian Aldrich-McKelvey scaling: <https://doi.org/10.1111/ajps.12151>
[^6]: Anchoring Vignettes (treat this as a sample reading, there are many others worth looking at as this is a method in its own right): <https://doi.org/10.1093/pan/mpl011>
[^7]: Scaling CHES with Bayesian AM and anchoring vignettes: <https://doi.org/10.1017/psrm.2020.26>
[^8]: Ordered Bayesian Aldrich-McKelvey scaling: <http://www.kevinmcalister.org/articles.html> (pdf link in the working papers section at the time of writing)
[^9]: Blackbox/blackbox transpose: <https://doi.org/10.2307/2991737>
[^10]: My Notes on AM Scaling: <https://philswatton.github.io/papers/00_am_notes.pdf>
[^11]: Categorization in Vote Choice: <https://doi.org/10.1017/S0007123415000393>
[^12]: `basicspace`: <https://doi.org/10.18637/jss.v069.i07>
[^13]: `psmisc`: <https://github.com/philswatton/psmisc>