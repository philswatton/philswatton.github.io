---
layout: post
title: Low-Dimensional Ideology is a Special Case of the Manifold Hypothesis
tag: Political Methodology
---

Political scientists often work with ideology in a low-dimensional setting. The 'left-right' dimension is a good example of this. It aggregates over many issue areas, and places individuals on a single dimension which _summarises_ their position across these issues. Someone who is very left-wing on the left-right dimension is probably strongly in favour of progressive taxation and of economic redistribution. We are working with low-dimensional ideology when we have a very small number of dimensions of ideology which summarise a large range of issues[^1].

The decision to work with ideology in this abstract, low-dimensional setting is not only convinient, it is also a principled theoretical decision. The classical work which sets up this claim is Converse's paper *The nature of belief systems in mass publics*[^2]. In this paper, Converse argued that ideology is best understood as set of attitudes which are bound together by *constraints*.

### Ideological Constraints

An obvious constraint is logic, which goes to the effect of "if you believe x, it makes sense to believe y". But there are other sources of constraint. Psychological constraints are those where if one is attached to a particular ideology or belief system such as Marxism, then one is constrained to hold beliefs associated with Marxism. Social constraints are a certain common sense of "what goes together", which are really culturally contingent between both time periods and contexts.

Exactly how constrained voters are is a matter of debate among political scientists, and voters vary in their level of constraint. More 'sophisticated' voters (i.e. those more knowledgeable about politics) are typically more constrained, and constrained in predictable ways. It's due to these constraints that the idea of low-dimensional ideology is a principled one to work with.

The theory of low-dimensional ideology has other names, including basic space theory[^3] or the predictive dimension[^4]. But the basic idea is always the same. When we are being causally agnostic, we say that the attitudes of voters on individual issues can be usefully summarised by a lower ideological dimension.

A causal interepretation, which I think is reasonably well-evidenced for at least a substantial chunk of the electorate, is that voters posses an ideology in the higher-dimensional abstract space, but not on individual issues. What this means is that a typical voter might have a left-right ideology, and draw on this in responding to a survey question about, say, redsitribution, but does not really have a meaningful view on redsitribution outside of their left-right opinion. This point isn't the one I want to focus on in this post, so all I'll say in justification is that it's not really plausible to hold sufficient expertise across all issue domains relevant to an election to hold well-formed opinions about them.

### The Manifold Hypothesis

The *manifold hypothesis* comes out of the machine learning world, and it posists that many high-dimensional data exist on latent low-dimensional manifolds inside the high-dimensional space. The hypothesis came about with the goal of explaining why certain dimensionality reduction techniques within data science are so effective.

The language is frankly above my own level of maths, but suffice to say if you read 'manifold' as 'mathematical space' and understand that ideological dimensions are mathematical spaces, you will get the point I'm aiming to make in this post, which is that the latent dimension theory is fairly obviously a special case of the manifold hypothesis.

### Implications for Political Scientists

Although not currently of direct practical use, I think this is a relevant point to make for a few reasons. From a political science angle, one of the activities of a practitioner of political methodology is to remain informed about methodological developments in adjacent fields such as statistics, data science, and computer science[^5].

Even if there is no direct methodological relevance _now_, _knowing_ that the low-dimensional theory is a special case of the manifold hypothesis enables political scientists to keep an eye on methodologial developments relating to the hypothesis which will enable work in political science.

For example, a paper titled *Testing the manifold hypothesis* published in the *Journal of the American Mathematical Society* presents a theory which could _in principle_ enable empirically testing for the presence of low-dimensional manfiolds[^6]. If the method were to be developed for applied use, this would have the obvious methodological benefit of enabling directly testing for the presence of a low-dimensional manifold in issue data. Historically, tests in political science for the presence of such manifolds are indirect (though still, I think, good).

### Implications for Data Scientists

The second reason is that insights can of course flow in the other direction. In their paper titled *Assessing the Structure of Policy Preferences: A Hard Test of the Low-Dimensionality Hypothesis* use multi-dimensional scaling (MDS) to test exactly how low-dimensional the American electorate is[^7].

They use MDS because, as they argue, it preserves the *distances* between individuals, rather than the variances of the issues in the survey. Because of this, it avoids producing a straightforwardly one-dimensional representation of the latent space, as PCA can (and in doing so it can 'squish' out more unsuaual but otherwise well-defined voters such as libertarians and left-authoritarians).

The first lesson for data scientists is both that MDS is as good a way as any to test the manifold hypothesis in a particular case; but also to think through in a principled way which parts of the data need to be preserved in selecting between data reduction methods. The second lesson is that, where the manifold hypothesis holds, it is likely to reflect an underlying causal structure in the data. There is a *reason* why it is possible to use low-dimensional representations of individual ideology, and that reason is Converse's constraints.

---

## Footnotes

[^1]: Poole, K.T. (1998) Recovering a basic space from a set of issue scales, *American Journal of Political Science* 42 (3). pp. 954-993
[^2]: Converse, P. E. (1964) The nature of belief systems in mass publics, *Critical Review* 18 (1-3). pp. 1–74
[^3]: Ordeshook, P.C. (1976) The Spatial Theory of Elections: A Review and a Critique, in Budge, I., I. Crewe and D. Farlie (eds), *Party Identification and Beyond: Representations of Voting and Party Competition*.
[^4]: Hinich, M.J. and Pollard, W. (1981) A New Approach to the Spatial Theory of Electoral Competition, *American Journal of Political Science* 25 (2). pp. 323-341
[^5]: Esarey, J., (2018) What Makes Someone a Political Methodologist?, *PS: Political Science & Politics*, 51 (3). pp. 588-596
[^6]: Fefferman, C., Mitter, S. and Narayanan, H., (2016) Testing the manifold hypothesis, *Journal of the American Mathematical Society*, 29 (4). pp. 983-1049
[^7]: Hare, C., Highton, B. and Jones, B., (2024) Assessing the Structure of Policy Preferences: A Hard Test of the Low-Dimensionality Hypothesis, *The Journal of Politics*, 86 (2). pp.672-686