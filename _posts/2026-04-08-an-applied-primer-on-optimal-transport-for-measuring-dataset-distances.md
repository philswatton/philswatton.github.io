---
layout: post
title: An Applied Primer on Optimal Transport for Measuring Dataset Distance
tag: Data Science
---

The optimal transport problem is the problem of finding the most efficient means of transforming one distribution into another. _Transportation theory_ is the subfield of mathematics concerned with this problem and its solutions. Solutions to the optimal transport problem turn out to be very useful in applied data science, and particularly as measures of _distance_ between datasets. In this post, I set out some of my notes from using optimal transport (OT) in this way, in the hope of keeping my future self informed and being of use to someone else in the process.

The notes here are aimed at applied users without formal backgrounds in university-level mathematics. A more mathematically grounded treatment is available in [Computational Optimal Transport](https://doi.org/10.48550/arXiv.1803.00567)_ by Gabriel Peyré and Marco Cuturi[^cot]. A distinction important to these notes is between declarative and imperative knowledge. Mathematics is frequently concerned with the former, applied data science and programming with the latter. I am providing you with declarative knowledge when I tell you about the existence of some function and what qualities it has. I am providing you with imperative knowledge when I tell you how to actually compute it.

## Optimal Transport, Declaratively

Before beginning, a point which will be useful when you read beyond these notes is on the notion of _space_. When you read about optimal transport you'll come across terms like _measurable space_, _Borel space_, _Polish space_, _Hilbert space_, and _reproducing kernel Hilbert space_ (RKHS). These are sets which contain mathematical objects (typicaly but not necessarily vectors) together with some notion of structure such as distance or inner product. Different names refer to specific assumptions about that structure. For the purposes of this post, you can treat _space_ as simply meaning _a set of vectors where we have a sensible way to measure distances_, which is all we actually need for optimal transport.

### Monge Formulation

Mathematicians aim to provide formal (read mathematical) descriptions of notions such as "finding the most efficient means of transforming one distribution into another", because this enables precision in meaning and definition. The first mathematician to formalise the optimal transport problem was Gaspard Monge, in 1781.

Consider two spaces, \\(\mathcal{X}_A\\) and \\(\mathcal{X}_B\\), with associated distributions \\(P_A\\) and \\(P_B\\). Given these sets and distributions over them, Monge formalises the optimal transport problem thus:

$$ \inf_{T, T_{\#}P_A=P_B}{\int{c(x, T(x))dP_A(x)}} $$

Where our goal is to find the transport map \\(T : \mathbb{R}^{k} \rightarrow \mathbb{R}^{k} \\), which maps points between the two spaces \\(\mathcal{X}_A\\) and \\(\mathcal{X}_B\\). \\(T\_{\\#}P_A=P_B\\) denotes that \\(P_B\\) is the push-forward of \\(P_A\\) under \\(T\\). This provides two constraints on \\(T\\), without which we could choose any arbitary map between the two spaces:

1. Every \\(x \in \mathcal{X}_A\\) maps onto exactly one \\(x' \in \mathcal{X}_B\\)
2. The output distribution of applying the transport map \\(T\\) to \\(P_A\\) assigns the same probability to each point in \\(\mathcal{X}_B\\) as \\(P_B\\)

\\(c\\) is a cost function which defines the cost of transporting from \\(x\\) to \\(T(x)\\) under the transport map \\(T\\). The integral (a brief reminder for my future self to think of integrals as continuous sums) is over \\(P_A(x)\\) and not \\(x\\) so that each cost \\(c(x, T(x))\\) is weighed by the probability mass in \\(P_A(x)\\) -- locations with more mass contribute more to the overall cost. If \\(P_A(x)\\) is a probability distribution (which we shall denote with a lower case \\(p\\)), then we would be able to straightforwardly write

$$ \inf_{T, T_{\#}p_A=p_B}{\int{c(x, T(x))p_A(x)dx}} $$

A map \\(T^\*\\) that is a minimiser[^infimum] of the overall cost is called the _optimal transport map_. However, such a map may not exist in the Monge formulation (e.g. where we want to transport a single point into two points, as mass splitting is not allowed).

### Kantorovich Formulation

For a long time the Monge formulation of the problem was where things rested. Eventually, in 1942, the Soviet mathematician and economist Leonid Kantorovich[^kantorovich] developed a new formulation of optimal transport[^translocation], which avoids the problem in the Monge formulation that a transport map may not exist. It does this by allowing 'mass splitting', where instead of requiring that all the probability assigned to point \\(x \in \mathcal{X}_A\\) goes to \\(x' \in \mathcal{X}_B\\), it can instead be spread across different points in \\(\mathcal{X}_B\\).

The Kantorovich formulation achieves this by instead searching for a joint distribution \\(\pi\\) with marginal distributions \\(P_A\\) and \\(P_B\\):

$$ \inf_{\pi \in \Pi(P_A, P_B)}{\int{c(x,x')d\pi(x, x')}} $$

Where \\(\Pi(P_A, P_B)\\) denotes the set of all possible joint distributions \\(\pi\\) for \\((\mathcal{X}_A, \mathcal{X}_B)\\) with marginal distributions \\(P_A\\) and \\(P_B\\). As before, the integral (another self-reminder to think of this is a continuous sum) computes the cost weighted by the probability mass, but this time weights by the mass in the joint distribution, with \\(x\\) being drawn from \\(\mathcal{X}_A\\) and \\(x'\\) being drawn from \\(\mathcal{X}_B\\).

A minimiser \\(\pi^*\\) exists for every Kantorovich optimal transport problem and is called the _optimal transport plan_ or _optimal transport coupling_. For the rest of this post, the Kantorovich formulation is the one I will consider.

### Wasserstein Distance

Until now, the cost function \\(c\\) has been left undefined. However, it turns out that if we choose a _distance metric_ as our cost function, then the Kantorovich formulation itself defines a distance metric. In mathematical terms, a metric is any function \\(d : X \times X \rightarrow \mathbb{R} \\) which satisifies the following four axioms:

1. Non-negativity: \\(d(x, y) \geq 0\\)
2. Identity of Indiscernibles: \\(d(x, y) = 0\\) if and only if \\(x = y\\)
3. Symmetry: \\(d(x, y) = d(y, x)\\)
4. Triangle Inequality: \\(d(x, z) \leq d(x, y) + d(y, z)\\)

When we choose

$$ \| x -  x' \|^p $$

as our cost function \\(c\\), then the distance defined by the Kantorovich formulation becomes known as the _p-Wasserstein_ distance, or \\(W_p\\). For instance, setting \\(p=2\\) would make this the 2-Wasserstein or \\(W_2\\) distance.

A brief note: a lot of textbooks and papers call the above the _Euclidean distance_, which I have always been confused by as this would require additionally taking the _p_-th root. I therefore avoid this language, but you should be aware of its use.

## Optimal Transport, Imperatively

So far, everything I have written has been _declarative_ in nature. I have told you _what_ the optimal transport is according to both Monge and Kantorovich, and under what conditions optimal transport defines a distance metric. But note I have provided no _imperative_ information on how to actually compute an optimal transport plan, or any associated cost. This kind of information is fairly important in data science, and so the remainder of this post provides you with different implementations.

### 2-Wasserstein Solution

It turns out that optimal transport distances frequently cannot be computed in practice in the continuous case[^continuous_case], because we do not observe \\(P_A\\) or \\(P_B\\), but instead only obtain the finite samples \\(\boldsymbol{X}_A\\) and \\(\boldsymbol{X}_B\\).

However, where \\(P_A\\) and \\(P_B\\) are both gaussian distributions, then it turns out that an analytic solution for computing \\(W_2\\) exists:

$$ W^{2}_{2}(P_A, P_B) = \| \boldsymbol{\mu}_A - \boldsymbol{\mu}_B \|^{2}_{2} + \text{tr}\left( \boldsymbol{\Sigma}_A + \boldsymbol{\Sigma}_B - 2\left( \boldsymbol{\Sigma}_{A}^{\frac{1}{2}} \boldsymbol{\Sigma}_B \boldsymbol{\Sigma}_{A}^{\frac{1}{2}} \right)^{\frac{1}{2}} \right) $$

where \\(\boldsymbol{\mu}_A\\) and \\(\boldsymbol{\mu}_B\\) are the mean vectors for \\(P_A\\) and \\(P_B\\) respectively, \\(\boldsymbol{\Sigma}_A\\) and \\(\boldsymbol{\Sigma}_B\\) are the variance-covariance matrices for \\(P_A\\) and \\(P_B\\) respectively, the trace of a square matrix is the sum of its diagonal, and \\(M^{\frac{1}{2}}\\) gives the matrix square root, which is defined by \\(S \cdot S = M\\).

We can use this analytic form to compute a dataset distance metric under the following conditions:

1. Our datasets \\(D_A\\) and \\(D_B\\) are both drawn from the same feature space (i.e. have the same features and the distance function above is well-defined between any two observations in each dataset). This is required as otherwise the matrix operations in the formula are not defined (and nor, indeed, would the euclidean distance between points from each dataset be)
2. We assume that the features of our datasets \\(D_A\\) and \\(D_B\\) both follow gaussian distributions

Where these conditions are met, we can compute the means and variance-covariance matrices from the features of both datasets, and compute \\(W^{2}_{2}\\) as a dataset distance metric.

Condition (1) turns out to be reasonable on toy datasets such as CIFAR-10 or MNIST, because these datasets contain images with a fixed number of dimensions (pixel RGB values). However, as we shall see, it turns out to be unreasonable yet difficult to relax in more realistic settings.

The assumption in condition (2) is however much less reasonable, albeit it turns out to be reasonably easy to drop if we are willing to compute the optimal transport solution in the discrete setting.

### Discrete Solution

The discrete version of the Kantorovich formulation can be set out as:

$$ \langle \boldsymbol{C}, \boldsymbol{T} \rangle = \inf_{\boldsymbol{T} \in \Pi(\boldsymbol{a}, \boldsymbol{b})} \sum^n_{i=1} \sum^m_{j=1} \boldsymbol{C}_{ij} \boldsymbol{T}_{ij} $$

where \\(\boldsymbol{a}\\) and \\(\boldsymbol{b}\\) are vectors representing discrete probability distributions (more on this in a moment), \\(\boldsymbol{C}\\) is a cost matrix defining the cost of moving an element of \\(\boldsymbol{a}\\) to \\(\boldsymbol{b}\\) (or vice versa), and \\(\boldsymbol{T}\\) is a _transport matrix_ between \\(\boldsymbol{a}\\) and \\(\boldsymbol{b}\\), and \\(\langle \boldsymbol{C}, \boldsymbol{T} \rangle\\) is the total cost.

Important to understand is that this is the discrete version of the Kantorovich formulation, with the sum of cost times probability replacing the integral of cost weighed by probability but being otherwise identical. The elements of the cost matrix are themselves determined by the cost function you choose.

#### Discretising the Input Data

Since we need discrete distributions, we'll often need to convert data into a discrete format. We have two options for how we go about preparing \\(\boldsymbol{a}\\) and \\(\boldsymbol{b}\\). The first option is to make histograms. We put our data into bins, where each bin corresponds to the probability of values in a particular region. Of course, if our data are already discrete, then we don't even need to make bins and can use the counts or proportions directly.

At first glance this sounds like it applies only to the case where we are comparing single-dimensional discrete distributions. However, each bin in the histograms \\(\boldsymbol{a}\\) and \\(\boldsymbol{b}\\) represents a region of the \\(\mathbb{R}^{k}\\) feature space. So for comparing k-dimensional distributions, a single point on the histogram corresponds to an \\(\mathbb{R}^{k}\\) region (for example, the first bin captures the probability that all colour values in all pixels will be between 0 and 8 inclusive, where we have chosen bins of size 8 and are working in pixel space). Note three important implications:

1. The number of bins grows exponentially with the number of features in our dataset, making binning harder as this increases
2. This is explicitly parameterised by how coarse-grained we wish our bins to be
3. The elements of the cost matrix should take into account the specific cost of transferring between the regions represented by each histogram, meaning the order of the bins of the histogram does not matter (this is also where we have retained condition (1))

We might therefore want to find an approach with avoids this combinatorial explosion and hyperparameterisation. A more common approach is to treat our samples as Dirac delta functions. A Dirac delta function \\(\delta(x-a)\\) has a value of 0 everywhere except at the point \\(a\\), meaning its properties are:

$$ \delta(x-a) = 0 \; \text{for} \; x \neq a, \;\;\; \int{\delta(x-a)dx} = 1 $$

What treating our samples as Dirac delta functions means _in practice_ is that given \\(N\\) samples \\(x_1, x_2, \cdots x_N\\), our empirical probability distribution can be represented as:

$$ \hat{P} = \frac{1}{N}\sum^{N}_{i=1}\delta(x-x_i) $$

In plainer language, we just say that every sample has probability mass \\(\frac{1}{N}\\) and all other regions have probability mass 0 and each data point forms its own bin in the histogram. Given two datasets \\(\mathcal{D_1}\\) and \\(\mathcal{D_2}\\) with \\(N_1\\) and \\(N_2\\) observations respectively, \\(\boldsymbol{a}\\) would be a vector of length \\(N_1\\) where each element has the value \\(\frac{1}{N_1}\\), and \\(\boldsymbol{b}\\) would be a vector of length \\(N_2\\) where each element has the value \\(\frac{1}{N_2}\\). The transport plan \\(\boldsymbol{T}\\) will be an \\(N_1 \times N_2\\) matrix.

This works for optimal transport because the cost matrix will preserve information about distances between data points. So even where our individual samples are k-dimensional vectors with continuous elements, this will work. This is usually what is meant by 'discretising' the data in optimal transport papers, which can be a bit misleading if you are used to 'discretise' meaning 'make continuous data disceret' and not 'just assign samples the same probability'. For the rest of this post you can assume that this is the approach taken to computing the discrete solution to optimal transport.

It is worth pointing out that we have subtly moved from treating our datasets as being drawn from probability distributions which we are trying to represent, towards treating the OT problem as being about moving mass between the points of one dataset and another. In the histogram approach we are trying to represent a continuous distribution from which the dataset has been sampled, in this approach the dataset _is_ the distribution.

Beyond consequences for interpretation, this move also means that our optimal transport problem will now scale with the number of samples, rather than the number of features, but the shared feature space between the two datasets is essential.

#### Solving the Discrete OT Problem

Because \\(\boldsymbol{a}\\) and \\(\boldsymbol{b}\\) should be marginal distributions of \\(\boldsymbol{T}\\), we have the constraints:

$$ \begin{align}
    \boldsymbol{T}\boldsymbol{1} = \boldsymbol{a}\\
    \boldsymbol{T}'\boldsymbol{1} = \boldsymbol{b}
\end{align} $$

Where \\(\boldsymbol{1}\\) is an vector of 1s of the same length as one of the dimensions of \\(\boldsymbol{T}\\). What these constraints say is that summing the matrix in a particular direction should produce its marginal.

A final constraint is that we cannot add or subtract mass, we can only move it. To enforce this, we have the further constraint:

$$ \forall \: i,j \; \boldsymbol{T}_{ij} \geq 0 $$

With these constraints, we have a well-defined _[linear programming](https://en.wikipedia.org/wiki/Linear_programming)_ or _linear optimisation_ problem. These involve finding a vector or matrix (such as our transport matrix) which maximises or minimises an equation (such as our total cost) subject to constraints (such as those we have just defined). This is sufficient for imperative instruction on how to compute optimal transport in the discrete setting, and so apply it as a distance metric in this setting.

How linear programming solvers work is beyond the scope of this blog post. However, linear programming solvers are available in python in general form via the `linprog` function in [`scipy.optimize`](https://docs.scipy.org/doc/scipy/reference/generated/scipy.optimize.linprog.html), and in optimal transport-specific form via the [`POT`](https://pythonot.github.io/) library.

They are likewise available in R in general form via the [`linprog`](https://cran.r-project.org/web/packages/linprog/index.html) library, or in optimal transport-specific form via the `Wasserstein` function in the [`T4transport`](https://cran.r-project.org/web/packages/T4transport/index.html) library. Many other languages also contain implementations of solvers. Worth mentioning for historical interest is that linear programming was originally developed by Kantorovich for the purpose of solving optimal transport problems[^kantorovich_again].

### Regularisation and Sinkhorn Distance

Solving linear programming problems however turns out to scale cubically (\\( O(n^3 \log n) \\)) as the input dimensions increase. It is therefore common in practice to use an entropy regularisation term[^sinkhorn]:

$$ \inf_{\boldsymbol{T} \in \Pi(\boldsymbol{a}, \boldsymbol{b})} \langle \boldsymbol{C}, \boldsymbol{T} \rangle - \epsilon H(\boldsymbol{T}) $$

where \\\(H\left(\boldsymbol{T}\right)\\) is the entropy of the transport matrix:

$$ H\left(\boldsymbol{T}\right) = - \sum^{n}_{i}\sum^{n}_{j} \boldsymbol{T}_{ij} \log \boldsymbol{T}_{ij} $$

and \\(\epsilon\\) is a regularisation parameter controlling the strength of the regularisation term. The regularisation term punishes transportation plans which are too concenrated, encouraging a more diffuse plan. This might seem odd at first as this runs counter to the notion of _optimal_ transport. However, note two things. First, as \\(\epsilon \rightarrow 0\\), then this will converge on the true optimal transport solution. Second, including the regularisation term enables much easier computation of the optimal transport distance.

Introducing the term means that the optimal transport matrix \\(\boldsymbol{T}^*\\) can now be given by:

$$ \boldsymbol{T}^* = \text{diag}(\boldsymbol{u})\boldsymbol{K}\text{diag}(\boldsymbol{v}) $$

where \\(\boldsymbol{K}\\) is given by

$$ \boldsymbol{K} = e^{-\boldsymbol{C}/\epsilon} $$

which is to say it is computed by exponentiating the negative of each element of \\(\boldsymbol{C}\\) divided by \\(\epsilon\\). Note that as elements of \\(\boldsymbol{C}\\) become smaller (and they should not be negative if we have chosen a distance metric), then these entries become large in \\(\boldsymbol{K}\\), while large costs become small in \\(\boldsymbol{K}\\) (due to the negative exponentiation). As epsilon becomes larger, it will make \\(\boldsymbol{K}\\) more diffuse, which is how it achieves regularisation of the transport plan.

\\(\boldsymbol{u}\\) and \\(\boldsymbol{v}\\) are vectors chosen to satisfy the marginal constraints from before, \\(\boldsymbol{T}\boldsymbol{1} = \boldsymbol{a}\\) and \\(\boldsymbol{T}'\boldsymbol{1} = \boldsymbol{b}\\). We can find them by performing coordinate descent, setting

$$ \boldsymbol{u} \leftarrow \frac{\boldsymbol{a}}{\boldsymbol{K}\boldsymbol{v}}, \boldsymbol{v} \leftarrow \frac{\boldsymbol{b}}{\boldsymbol{K}'\boldsymbol{u}} $$

where the divisions are element-wise.

Convergence is usually assessed in one of two ways. First, we can check that the marginal constraints are satisfied to some tolerance \\(\delta\\) to see if

$$ \boldsymbol{u} \odot \left( \boldsymbol{Kv} \right) \approx \boldsymbol{a} $$

where \\(\odot\\) refers to element-wise multiplication.

Alternatively, it is also possible to assess the amount of change in \\(\boldsymbol{u}\\) or \\(\boldsymbol{v}\\) between iterations, although this is less principled and does not guarantee that the marginal constraints are satisfied:

$$ \| \boldsymbol{u}^{(t)} - \boldsymbol{u}^{(t-1)} \|_1 \leq \delta $$

When computing the optimal transport plan and distance in this way, the output distance is sometimes called the Sinkhorn distance, as the algorithm used to compute it is the Sinkhorn-Knopp matrix scaling algorithm. Unlike the original linear programming problem, it scales at \\(O(n^2)\\), and so is a significant speedup over the original in terms of compute cost. There is often in practice a trade-off between the choice of epsilon and the compute cost involved.

For some reason, the Sinkhorn distance is often written in continuous terms as (note the plus is used due to the negatives cancelling out):

$$ \inf_{\pi \in \Pi(P_A, P_B)}{\int{c(x,x')d\pi(x, x')} + \epsilon H(\pi | P_A \otimes P_B)} $$

and the formula for entropy is also often given in continuous terms. However, whenever anyone is speaking about regularised optimal transport, they are addressing the discrete setting. This will, as we shall see, become important for understanding some of the dataset similarity-specific metrics.

### Sinkhorn Divergence

Because our entropy regularisation forces the transport plan to be more diffuse, our optimal transport distance is now an over-estimate of actual distributional distance. The Sinkhorn divergence[^sinkhorn_divergence] (sometimes called the debiased Sinkhorn distance) addresses this problem, and is estimated as:

$$ \text{SD}_{\epsilon}\left(P_A, P_B\right) = \text{OT}_{\epsilon}\left(P_A, P_B\right) - \frac{1}{2}\text{OT}_{\epsilon}\left(P_A, P_A\right) - \frac{1}{2}\text{OT}_{\epsilon}\left(P_B, P_B\right) $$

where \\(\text{OT}_{\epsilon}\\) is the Sinkhorn distance estimated with a given value of \\(\epsilon\\).

The intuition is that the Sinkhorn distance strictly speaking is not a metric because the distance of a distribution from itself will be greater than 0 if \\(\epsilon > 0\\). The Sinkhorn divergence restores this property as \\(\text{SD}_{\epsilon}\left(P_A, P_A\right) = 0\\) by construction (because we subtract half of each self-transport cost, which cancels exactly when both inputs are the same). However, this comes at the expense of needing to compute the OT distance three times over.

In Python the Sinkhorn distance is implemented in the `sinkhorn` function in the [`POT`](https://pythonot.github.io/) library, and similarly via the `SamplesLoss` class (setting `loss="sinkhorn"` when instantiating) in the [`geomloss`](https://www.kernel-operations.io/geomloss/) library. The latter of these also directly handles sinkhorn divergences by setting `debias=True`, but note that having a sinkhorn distance is on its own sufficient to compute the divergence. The [`flash-sinkhorn`](https://github.com/ot-triton-lab/flash-sinkhorn) library claims to implement a faster version of the same class. In R the Sinkhorn distance is implemented in the `sinkhorn` function in the [`T4transport`](https://cran.r-project.org/web/packages/T4transport/index.html) library.

## Optimal Transport Dataset Distance (OTDD)

So far, we have treated datasets as though they are label-free. In the supervised learning setting however this assumption is obviously incorrect, and it would be a strange dataset similarity metric which did not respond to actions such as label shuffling in this setting. Optimal transport dataset distance[^otdd] (OTDD) is a particularly interesting dataset similarity metric because it explicitly incorporates dataset labels, and allows them to be entirely disjoint.

We start by defining a dataset \\(\mathcal{D}\\) as a set of feature-label pairs \\((x, y) \in \mathcal{X} \times \mathcal{Y}\\) over a feature space \\(\mathcal{X}\\) and a label space \\(Y\\) (I don't love this definition of dataset as set, because it precludes the possibility of identical observations, which can sometimes arise under certain conditions in reality). We will sometimes use \\(z = (x,y)\\) and \\(\mathcal{Z} = \mathcal{X} \times \mathcal{Y}\\) for convenience. We will treat \\(\mathcal{D}_A\\) as being roughly distributed along \\(P_A(x,y)\\), that is \\(\mathcal{D}_A \sim P_A(x,y)\\), and similarly \\(\mathcal{D}_B \sim P_B(x,y)\\). What we want to achieve is a distance metric between these two datasets.

### A Problem

Direct application of optimal transport on these datasets turns out to be challenging. The problem is selecting a cost function with which to construct our cost matrix. If we had distance metrics \\(d_{\mathcal{X}}(x, x')\\) for defining distance between points in \\(\mathcal{X}\\), and \\(d_{\mathcal{Y}}(y,y')\\) for defining distance between points in \\(\mathcal{Y}\\), then we would have a distance metric between points in \\(\mathcal{Z}\\):

$$ d_{\mathcal{Z}}(z, z') = \sqrt[p]{\left(d_{\mathcal{X}}(x, x')^p + d_{\mathcal{Y}}(y, y')^p\right)} $$

Unfortunately, while there are many candidates for \\(d_{\mathcal{X}}\\) such as the euclidean distance, metrics between labels are rarer. When we have continuous labels (as in regression problems) we could simply use the euclidean distance for these two, but in typical supervised learning settings we have labels such as `"cat"` and `"car"` between which there is no meaningful distance metric. The problem is exacerbated if the labels are entirely disjoint.

### A Solution

What we do however have is the relationship between the labels and the features underneath them. We can treat the collection of features under a given label

$$ \mathcal{N}_{\mathcal{D}}(y) := \left\{x \in \mathcal{X} | (x,y) \in \mathcal{D}\right\} $$

as being distributed according to \\(P_y\\). At this point, given two distributions \\(P_{y}\\) and \\(P_{y'}\\) for the labels \\(y\\) and \\(y'\\), we can compute the optimal transport distance between these distributions using the finite samples \\(\mathcal{N}_{\mathcal{D}}(y)\\) and \\(\mathcal{N}\_{\mathcal{D}}(y')\\).

Our distance metric \\(d_{\mathcal{Z}}\\) is therefore given by:

$$ d_{\mathcal{Z}}((x,y), (x',y')) = \sqrt[p]{\left(d_{\mathcal{X}}(x, x')^p + \text{OT}(P_{y}, P_{y'})^p\right)} $$

Note that in this equation, OT is used to define a point-wise distance between two labels, \\(y\\) and \\(y'\\), and that \\(d_{\mathcal{Z}}\\) itself simply computes the distance between two samples \\((x,y)\\) and \\((x',y')\\). We can now however use this distance metric as a cost function in optimal transport, computing the optimal transport dataset distance as:

$$ d_{\text{OT}}\left(\mathcal{D}_A, \mathcal{D}_B\right) = \inf_{\pi \in \Pi(P_A, P_B)}{\int{d_{\mathcal{Z}}(z,z')d\pi(z, z')}} $$

where \\(d_{\text{OT}}\\) is the optimal transport dataset distance. We call this the outer OT problem, and the pairwise label distances the inner OT problem (or problems). Note that in this formulation, we have allowed for entirely disjoint label sets: only the feature space needs to be shared between datasets.

### OTDD, Imperatively

In normal settings, the most prohibitive cost is in solving the LP problem. But because we have several inner OT problems, computing the pointwise distances to produce the cost matrix risks being the most computationally prohibitive step in OTDD. As we already know, there are two approaches to computing an OT solution between two collections of features. We can either treat the distributions as gaussian and compute the \\(W_{2}\\) distance, or we can compute a discrete solution, possibly after discretising our features if necessary. Because the latter can be computationally expensive, and OTDD requires computing OT solutions between pairs of labels, the authors opt for the former rather than the latter for the inner OT problem. We label this variant of OTDD as \\(d_{\text{OT}-\mathcal{N}}\\).

Although this is only an approximation due to the assumption that features follow a gaussian distribution on the inner OT problem (although it is exact when the assumption is true), this turns out to express a lower bound on the true OTDD solution, because using a gaussian distribution underestimates the true cost and so provides a conservative estimate:

$$ d_{\text{OT}-\mathcal{N}}\left(\mathcal{D}_A, \mathcal{D}_B\right) \leq d_{\text{OT}}\left(\mathcal{D}_A, \mathcal{D}_B\right) $$

\\(W_2\\) as defined requires computing matrix square roots, which requires eigendecomposition to be computed exactly, which is expensive. An alternative is to compute an approximation, and the OTDD authors use the Newton-Schulz iterative method to do this. Their implementation additionally precomputes the pairwise label distances between the two datasets and retrieve them on demand while solving the outer problem.

At this point, we are free to compute the outer OT problem via linear programming, including via Sinkhorn distance or divergence.

### The Original OTDD Implementation

The authors have implemented OTDD in a python library called `otdd` at the Github repository <https://github.com/microsoft/otdd/>, though note there is no tagged release which is, suffice to say, problematic for actually making use of their metric. The python implementation of the metric within the repository is at <https://github.com/microsoft/otdd/blob/main/otdd/pytorch/distance.py>. Note that the following section will go into some detail on using this implementation, and you can skip to the next section on OTCE if this isn't of interest.

The codebase has additionally not been maintained for at least four years, presumably because Microsoft has not felt the need to do so. It is worth anticipating some compatibility issues if seeking to use the library at this point. The implementation provided uses a much larger range of parameters than one might assume given the preceding discussion, and it is worth pausing to go through some of these to explain them given the preceding discussion.

The `otdd` library implements OTDD via a class called `DatasetDistance`. The `distance` method of this class is called when it is time to actually compute OTDD, while `subgroup_distance` can be called to compute the OTDD on subsets of the datasets as defined by label selections (presumably useful for experiments based on comparing subsets of the same dataset, which can be a common approach in dataset distance papers).

To instantiate the class, there are a large number of arguments. The initial arguments concern the general inputs to the class. Here's the first set, with indentation removed:

```python
self, D1=None, D2=None,
## General Arguments
method='precomputed_labeldist',
symmetric_tasks=False,
feature_cost='euclidean',
src_embedding=None,
tgt_embedding=None,
ignore_source_labels=False,
ignore_target_labels=False,
```

Most of these are relatively straightforward. `D1` and `D2` are the datasets we want to compute a dataset over and both should be a `torch.Dataset` or `torch.DataLoader` (or inherit from them). `symmetric_tasks` can be set to `True` if the input datasets are the same, which saves some computation (as far as I can tell by only loading the dataset once). `feature_cost` determines the cost function between features, and should either be `"euclidean"` (which you'll probably want) or otherwise a `callable` which implements a cost function between feature vectors.

`src_embedding` and `tgt_embedding` optionally allow for embedding functions for the input datasets to be passed respectively which will be applied prior to computing any OT distance (source and target have no special meaning and are simply common choices in older ML work, especially NLP). `ignore_source_labels` and `ignore_target_labels` are interesting given OTDD in theory requires dataset labels, and can be set to `True` to allow unsupervised comparisons. What I _think_ this does from my initial skim of the code is uses DBSCAN (a clustering algorithm) to produce labels prior to performing OTDD. This could be useful for comparing a labelled versus an unlabelled dataset.

Compared to the rest of these, the `method` argument however requires slightly deeper treatment.

#### The `method` Argument

`method` takes on one of three values: `"precomputed_labeldist"`, `"augmentation"`, or `"jdot"`. The description the authors give of this argument in the docstring is:

> if set to 'augmentation', the covariance matrix will be approximated and appended to each point, if 'precomputed_labeldist', the label-to-label distance is computed exactly in advance.

What this _sounds_ like is a choice to either precompute the label-to-label distances, or otherwise to compute the costs on a per-data point basis. This isn't what it does and is rather poorly worded, not least because the docstring lists two methods but the class implements three options. As far as I have been able to work out, the `"augmentation"` option implements what in the OTDD paper is a brief thought of the authors, where they suggest that if we represent each \\((x,y)\\) as a stacked vector

$$ \bar{x} := [x; \boldsymbol{\mu}_{y}; \text{vec}\left(\boldsymbol{\Sigma}^{1/2}_{y}\right)] $$

for the corresponding feature mean and covariances under the label, then we can define \\(d_{\mathcal{Z}}\\) as

$$ \| \bar{x} - \bar{x}' \| $$

and use this as a cost function. This approach assumes that (1) there is an identity between \\(d_{\mathcal{X}}\\) and \\(d_{\mathcal{Y}}\\) and that (2) all variance-covariance matrices commute, that is \\(\boldsymbol{\Sigma}_1\boldsymbol{\Sigma}_2 = \boldsymbol{\Sigma}_2\boldsymbol{\Sigma}_1\\), which is unlikely to be true in practice, necessitating the use of matrix diagonalization. I won't consider this approach further in this blog.

The `"jdot"` option is the interloper relative to the docstring and the paper. What this implements is the joint distribution optimal transport[^jdot] (JDOT), which defines \\(d_{\mathcal{Y}}\\) as a loss function combining the distances between sample features and a loss function measuring the discrepancy between \\(y\\) and \\(y'\\). JDOT is briefly mentioned in another work by the OTDD authors[^jdot_mention], which presumably motivates its inclusion in `otdd`. One limitation of this approach relative to OTDD is it requires shared label spaces. I also won't consider this approach further in this blog.

This leaves us with  `"precomputed_labeldist"`, which, as hinted at by its name, implements OTDD as described: by pre-computing label distances to solve the inner OT problem then solving the outer OT problem. For OTDD, this is the option you should choose.

#### Outer OT Problem Arguments

The next set of arguments used to instantiate the class and their defaults are used for the outer OT problem, which is largely computed via `geomloss.SamplesLoss` from the [geomloss](https://www.kernel-operations.io/geomloss/) package, which implements both the Sinkhorn distance and divergence as a loss function.

```python
## Outer OT (dataset to dataset) problem arguments
loss='sinkhorn', debiased_loss=True, p=2, entreg=0.1,
λ_x=1.0, λ_y=1.0,
```

`loss` must be `"sinkhorn"` and is passed directly to `geomloss.SamplesLoss`. If `debiased_loss` is `True` then the Sinkhorn divergence will be computed instead of the Sinkhorn distance and is passed to the `debias` flag of `geomloss.SamplesLoss`. `p` is \\(p\\) in the OTDD distance. `entreg` is \\(\epsilon\\) and controls the strength of regularisation. `λ_x` and `λ_y` are interesting additions not mentioned in the paper, and weigh the contribution of the feature versus label distance in \\(d_{\mathcal{Z}}\\). Specifically, they mean that our distance function is now:

$$ d_{\mathcal{Z}}((x,y), (x',y')) = \sqrt[p]{\left(\lambda_x d_{\mathcal{X}}(x, x')^p + \lambda_y \text{OT}(P_{y}, P_{y'})^p\right)} $$

The defaults of `1.0` produces the initial distance described above and are sensible defaults, but I suspect could be interesting to explore tweaking these depending on the application. Based on my skim of the codebase, I _think_ that setting `λ_y=0.` will result in a normal OT problem (that is it will compute the sinkhorn distance or divergence depending on your selected arguments when `method="precomputed_labeldist"`).

#### Inner OT Problem Arguments

Next, we have the arguments specific to the inner optimal transport problem.

```python
## Inner OT (label to label) problem arguments
inner_ot_method = 'gaussian_approx',
inner_ot_loss='sinkhorn',
inner_ot_debiased=False,
inner_ot_p=2,
inner_ot_entreg=0.1,
```

`inner_ot_method` selects the method for computing the inner label distances, and has the options `"gaussian_approx"` for computing as described above, `"exact"` if preferring to solve exact OT problems on the labels, or `"naive_upperbound"` for computing an upper bound on the exact distance. The docstring mentions `"jdot"` for using the classification loss as in JDOT, but I think this is a mistake and should have been described under `method` as this is not a valid argument for `inner_ot_method`. For most settings one of the first two should be used, though it is worth exploring the compute cost trade-offs between them[^exact_labels].

`inner_ot_loss` is only used when `inner_ot_method="exact"`, and can be `"sinkhorn"` or `"wasserstein"` depending on whether you want regularised or exact OT. `inner_ot_debiased` being set to `True` will result in the sinkhorn divergence being used when `inner_ot_method="exact"` and `inner_ot_loss="sinkhorn"`. `inner_ot_p` is the \\(p\\) on the inner OT problem, and `inner_ot_entreg` is the regularisation on the inner OT problem when `inner_ot_method="exact"` and `inner_ot_loss="sinkhorn"`. Most of the options here therefore concern the exact setting.

#### Gaussian Approximation Arguments

The next set of arguments control the Gaussian approximation of the inner optimal transport problem when `inner_ot_method="gaussian_approx"`.

```python
## Gaussian Approximation Args
diagonal_cov=False,
min_labelcount=2,
online_stats=True,
sqrt_method='spectral',
sqrt_niters=20,
sqrt_pref=0,
nworkers_stats=0,
```

`diagonal_cov` determines whether to compute diagonal approximations to the covariances, and must be `true` when `method="augmentation"`. `min_labelcount` sets the minimum number of observations for a label class to be used in the computation of the distance (and so really belongs with the earlier arguments on the inner OT problem, but I am following the author's comments in the code). `online_stats` if `True` results in the means and covariances being computed online (e.g. part by part, instead of loading everything into memory), and if `False` will load them from memory.

`sqrt_method` determines the method for computing the square root matrices. The documentation states that setting this to `"spectral"` or `"exact"` will result in eigendecomposition being performed, with the latter being slower, but note the following from the `__init__` method:

```python
if self.sqrt_method == 'exact':
    self.sqrt_method = 'spectral'
```

Setting this to either of these therefore results in the eigendecomposition being computed via SVD (this is a standard approach in numerical linear algebra, as it is computationally stable). Otherwise, this can be set to `"approximate"` for computing the matrix via Newton-Schulz, which is what is actually described in the paper and is probably much faster. When we do set `sqrt_method="approximate"`, `sqrt_niters` sets the number of iterations for Newton-Schulz.

`sqrt_pref` as far as I understand it determines which dataset's covariance square root should be used in computing the label distances. This doesn't matter in pure distance measurement settings, but matters when backpropagating through the distance, as it controls which dataset's covariance the gradient flows through (see the second paper of the authors cited in footnote [^jdot_mention]). `nworkers_stats` sets the number of parallel workers for estimating the means and covariance matrices in the inner OT problem.

#### Miscellaneous Arguments

Finally, we have the arguments the authors consider to be miscellaneous.

```python
## Misc
coupling_method='geomloss',
nworkers_dists=0,
eigen_correction=False,
device='cpu',
precision='single',
verbose=1, *args, **kwargs
```

`coupling_method` is only relevant if when calling `distance` we set `return_coupling=True`, which makes the method also return the transport plan \\(\boldsymbol{T}^*\\). If set to `geomloss`, this will be reconstructed from the `geomloss.SampleLoss` result, which is faster but less precise. Alternatively, if set to `pot`, then a new plan will be computed via the [`POT`](https://pythonot.github.io/) library, which is slower but more precise. When `return_coupling=False`, only the distance is returned from the `distance` method, while when `True`, a tuple containing the distance and the transport plan is returned.

`nworkers_dists` sets the number of parallel workers in distance computation. `eigen_correction` determines whether to use eigen correct when computing covariance matrices for additional numerical stability. `device` sets the device on which to perform computation (this takes standard `torch` device arguments), while `precision` should be `"single"` or `"double"` and does what you expect. `verbose` is marked as a string in the docstring but here takes an `int` and apparently sets the level of verbosity -- I haven't worked out where though. The `*args` and `**kwargs` as far as I can tell aren't used (and if so would be better dropped to stop silent errors from misspellings in the actual kwargs).

#### The `distance` Method

By now, you already know most of what you need to know about the class' `distance` method. Depending on the arguments you provide at initialisation, it will compute one of three metrics, with a range of options to customise their computation. It will return either a distance alone, or a distance plus an optimal transport plan. The method itself has two arguments with defaults, both worth mentioning: `maxsamples=10000` and `return_coupling=False`. The latter has already been mentioned and simply determines whether or not to return the transport plan or not.

`maxsamples=10000` sets the maximum number of samples to use on the _outer_ optimal transport problem. The metric as implemented in other words won't use the full datasets provided. Inside the method is additionally a hard limit on the number of samples to use with GPU: `GPU_LIMIT = 10000`. Where the number of samples from either dataset is greater than this, computation is automatically done on CPU:

```python
if (self.n1 > GPU_LIMIT or self.n2 > GPU_LIMIT) and maxsamples > GPU_LIMIT and self.device != 'cpu':
    logger.warning('Warning: maxsamples = {} > 5000, and device = {}. Loaded data' \
            ' might not fit in GPU. Computing distances on' \
            ' CPU.'.format(maxsamples, self.device))
    device_dists = 'cpu'
```

Given the paper and code were written in 2020, this probably isn't entirely insensible and probably reflected the author's needs at the time. That said, it's surprising (and frustrating) that the limit is hard-coded in this way. The `5000` in the warning is however an error and should be `10000`. This limitation of the code is nonetheless one reason you may find a need to edit the codebase (or re-implement the metric). Given the metric was also developed on relatively toy data, it would be interesting to explore what sample size is required on more realistic datasets, especially with a large number of (potentially imbalanced) classes.

### Further Development: s-OTDD

Other papers have since developed on OTDD. The main development of interest is sliced OTDD[^sotdd] (s-OTDD), in part because it offers new metric which seeks to approximate the OTDD, and in part because the authors have also published a codebase on GitHub at <https://github.com/hainn2803/s-OTDD>. It takes advantage of the sliced Wasserstein distance, which itself develops on the Wasserstein distance in the one-dimensional setting. A caveat that I'm less confident in my understanding of the s-OTDD, so anticipate that some mistakes may exist in the following section.

#### 1D Wasserstein

It turns out that when comparing two one-dimensional distributions, the Wasserstein distance has a closed-form solution based on the inverse CDFs (recall that this takes in a probability and returns a value, whereas a CDF takes in a value and returns a probability) of those distributions:

$$ W_p(P_A, P_B) = \left(\int_{0}^{1}\| F^{-1}_{A}\left(q\right) - F^{-1}_{B}\left(q\right) \|^p dq\right)^{\frac{1}{p}} $$

where \\(q\\) represents quantiles and \\(F_A\\) is the CDF of \\(P_A\\).

To compute this distance between two vectors \\(\boldsymbol{v}_1\\) and \\(\boldsymbol{v}_2\\) in practice, perform the following steps:

1. If the vectors are not the same length, extract \\(N_q\\) quantile points, and sort them, creating vectors \\(\boldsymbol{q}_1\\) and \\(\boldsymbol{q}_2\\).
2. Compute the following quantity:

$$ W_p \approx \left(\frac{1}{N_q}\sum_{i=1}^{N_q}\|\boldsymbol{q}_{1i} - \boldsymbol{q}_{2i}\|^p\right)^{\frac{1}{p}} $$

If the vectors are the same length \\(N\\), we can simply sort and then compute the following directly:

$$ W_p = \left(\frac{1}{N}\sum_{i=1}^{N}\|\boldsymbol{v}_{1i} - \boldsymbol{v}_{2i}\|^p\right)^{\frac{1}{p}} $$

#### Sliced Wasserstein

The sliced Wasserstein distance extends this computation to \\(k\\)-dimensional settings. Assume we have two finite matrices \\(\boldsymbol{X}_A\\) and \\(\boldsymbol{X}_B\\) drawn from shared feature spaces, with \\(N_A \times k\\) and \\(N_B \times k\\) elements respectively. The problem is that each row is a vector, when we need them to be scalars, so we can compute the 1-D Wasserstein.

We therefore need to project each row of our matrix to a scalar, and in the process project our matrix into a vector. The solution is to sample a length-k unit column vector \\(\boldsymbol{\theta} = (\theta_1 \cdots \theta_k)^{T} \in S^{k-1}\\) (elements are bounded [-1,1], sum of squares of elements is equal to 1 -- you may see this described as sampling a unit vector from the unit sphere -- and note that \\(S^{k-1}\\) is standard notation for a unit sphere living in \\(\mathbb{R}^k\\)) and use this to project the matrices into the length \\(N_A\\) and \\(N_B\\) vectors \\(\boldsymbol{X}_A\boldsymbol{\theta}\\) and \\(\boldsymbol{X}_B\boldsymbol{\theta}\\).

We repeat this process over and over, computing the sliced Wasserstein as:

$$ SW_p(P_A, P_B) =  \left(\int_{S^{k-1}} W^{p}_{p}\left(P_{A,\boldsymbol{\theta}}, P_{B,\boldsymbol{\theta}}\right)d\boldsymbol{\theta}\right)^{\frac{1}{p}} $$

In practice we approximate this using monte carlo, with \\(N_u\\) finite draws of unit vectors (100 to 1000 seems to be standard):

$$ SW_p(P_A, P_B) \approx \left(\frac{1}{N_u}\sum_{i=1}^{N_u} W^{p}_{p}\left(P_{A,\boldsymbol{\theta}_i}, P_{B,\boldsymbol{\theta}_i}\right)\right)^{\frac{1}{p}} $$

Note that this is sometimes written as averaging the 1-D Wasserstein distance over Radon transforms:

$$ SW_p(P_A, P_B) =  \left(\int_{S^{k-1}} W^{p}_{p}\left(\mathcal{R}_{\boldsymbol{\theta}}P_A, \mathcal{R}_{\boldsymbol{\theta}}P_B\right)d\boldsymbol{\theta}\right)^{\frac{1}{p}} $$

Or, equivalently, as computing the expected value of the 1-D Wasserstein distance over Radon transforms (this is the name for the kind of projection we have just performed):

$$ SW_p(P_A, P_B) = \mathbb{E}_{\boldsymbol{\theta} \sim S^{k-1}} \left[  W^{p}_{p}\left(\mathcal{R}_{\boldsymbol{\theta}}P_A, \mathcal{R}_{\boldsymbol{\theta}}P_B\right) \right] $$

The main advantage of this approach is its computational simplicity relative to other approaches to computing the Wasserstein distance, at the cost of being an approximation.

#### The Moment Transform Projection (MTP)

The s-OTDD authors are seeking to obtain the computational benefits of sliced Wasserstein for computing the OTDD. However, the basic probem is that the feature projection we have used above (the Radon transform) which maps from a vector to a scalar does not take labels into account. We will therefore need to develop a feature projection which _does_ take labels into account.

To do this we are going to need three components:

1. The **conditional distribution of features** under the label \\(y\\). Recall from OTDD that the **collection of features** under  \\(y\\) is given by:

   $$ \mathcal{N}_{\mathcal{D}}(y) := \left\{x \in \mathcal{X} | (x,y) \in \mathcal{D}\right\} $$

   and its distribution is:

   $$ P_y $$

2. The **feature projection**:

   $$ \mathcal{F}P_{\theta} : \mathcal{X} \rightarrow \mathbb{R} $$

   which is a function mapping from the space \\(\mathcal{X}\\) to a scalar in \\(\mathbb{R}\\) (i.e. a single real number) given a projection parameter \\(\theta\\). Note that this is a more general version of the projection we used above, and includes Radon transforms but also convolutions.
3. Given one-dimensional distribution \\(P \in P(\mathbb{R})\\) with density function \\(f_P\\), the \\(\lambda\\)-th **scaled moment**:

   $$ \mathcal{SM}_{\lambda}(P) = \int_{\mathbb{R}} \frac{x^{\lambda}}{\lambda !} f_{P}(x) dx $$

   which seems horrendous, but note that setting \\(\lambda = 1\\) involves simply computing the mean. Moments of a function refer to quantities which describe the shape of that function's graph. Other moments for probability distributions include the variance, the skew, the kurtosis, etc[^moments].

We now have everything we need to define the **moment transform projection** (MTP):

$$ \mathcal{MTP}_{\lambda, \theta}(P) = \mathcal{SM}_{\lambda}(\mathcal{F}P_{\theta}(P)) = \int_{\mathbb{R}} \frac{\mathcal{F}P_{\theta}(x)^{\lambda}}{\lambda !} f_{P}(x) dx $$

Which looks much more complicated than it is. Recall that we can set \\(P_y\\) be a vector \\(\boldsymbol{c}\\) where each element is \\(1/N\\), each element of the vector corresponding to one element of the dataset. Then the MTP is empirically computed as

$$ \mathcal{MTP}_{\lambda, \theta}(P_y) = \frac{1}{N} \sum_{i=1}^{N} \frac{\mathcal{F}P_{\theta}(\boldsymbol{x}_i)^{\lambda}}{\lambda !} $$

What the MTP does, in effect, is project the distribution of features under the label to a single scalar, first by transforming each sample \\(\boldsymbol{x}\_i\\) (which might be an image, or a vector after embedding) under \\(y\\) to a scalar through our feature projection \\(\mathcal{F}P_{\theta}\\), then by computing a scaled moment such as the mean over these scalars.

#### Putting It All Together

We're now ready to compute the s-OTDD. We shall slightly redefine a data point \\(\left(\boldsymbol{x}, y\right)\\) as pair of features and a distribution over features, that is \\(\left(\boldsymbol{x}, P_y\right) \in \mathcal{X} \times \mathcal{P}(\mathcal{X}) \\). Then we define the **data point projection** as:

$$ \mathcal{DP}_{\boldsymbol{\psi}, \theta, \boldsymbol{\lambda}, \phi}^{k} \left(\boldsymbol{x}, P_y\right) = \psi^{(1)}\mathcal{F}P_{\theta}(\boldsymbol{x}) + \sum_{i=1}^{k}\psi^{(i+1)} \mathcal{MTP}_{\lambda^{(i)}, \phi}\left(P_y\right) $$

where \\(\boldsymbol{\psi} = \\{\psi^{(1)}, \cdots, \psi^{(k+1)}\\} \in \mathbb{S}^{k}\\) (recall that a \\(\mathbb{S}^{k-1}\\) unit sphere lives in \\(\mathbb{R}^{k}\\)), and \\(\boldsymbol{\lambda} = \\{\lambda^{(1)}, \cdots, \lambda^{(k)}\\}\\). What this equation is computing is the weighted sum of the feature projection of the original feature points plus \\(k\\) MTPs. Note that the weights are sampled from the unit shere, i.e. are a unit vector.

When computing this for real, we can set \\(\theta = \phi\\) so that the feature transform both inside and outside the MTP is the same.

Now we have a function for transforming a feature-label pair into a scalar, we can compute the s-OTDD:

$$ \text{sOTDD}_{p}^{p}\left(\mathcal{D}_A, \mathcal{D}_B\right) = \mathbb{E} \left[W_{p}^{p} \left( \mathcal{DP}_{\boldsymbol{\psi}, \theta, \boldsymbol{\lambda}, \phi}^{k}\left(\mathcal{D}_A\right), \mathcal{DP}_{\boldsymbol{\psi}, \theta, \boldsymbol{\lambda}, \phi}^{k}\left(\mathcal{D}_B\right) \right) \right] $$

where we are using the data point projection to convert each dataset into a vector then computing the 1-D Wasserstein distance between them, which is, in effect, the sliced Wasserstein distance. The main difference is that we have replaced the Radon transform with the data point projection because the latter takes labels into account.

#### s-OTDD Hyperparameters

Like OTDD, this metric is highly parameterised, and we need to make several decisions. The first is on the value of \\(k\\). A simple approach is to simply choose a number. Higher values are preferable, because a larger number of moments captures more information on the distribution they describe. The authors perform an ablation varying \\(k\\) from 1 to 6, though in their code seem to have 8 as a default if no value is supplied[^default_k_sottd], i.e. \\(\boldsymbol{\lambda} = \\{1, 2, \cdots, 8\\}\\).

Second, because we are computing an expectation, we are going to have to use monte carlo to approximate the expectation, making \\(L\\) draws of our parameters:

$$ \widehat{\text{sOTDD}}_{p}^{p}\left(\mathcal{D}_A, \mathcal{D}_B, L\right) = \frac{1}{L}\sum_{l}^{L} W_{p}^{p} \left( \mathcal{DP}_{\boldsymbol{\psi}_{l}, \theta_{l}, \boldsymbol{\lambda}, \phi_{l}}^{k}\left(\mathcal{D}_A\right), \mathcal{DP}_{\boldsymbol{\psi}_{l}, \theta_{l}, \boldsymbol{\lambda}, \phi_{l}}^{k}\left(\mathcal{D}_B\right) \right) $$

Finally, we will need to choose a feature projection, which will probably be a Radon transform (as above) or a convolution. This will also implicitly chose what \\(\theta\\) and \\(\phi\\) are supposed to be, e.g. a vector in the former case. The authors implement both in their code.

We will also need to make sure we have a function for sampling from the unit sphere, both for \\(\boldsymbol{\psi}\\) and potentially (if using Radon transforms) \\(\theta\\) and \\(\phi\\). But at this point, we have everything we need.

## Optimal Transport based Conditional Entropy (OTCE)

Optimal Transport based Conditional Entropy[^otce] (OTCE) is another distributional similarity measure developed based on optimal transport with labelled dataset similarity settings in mind. Recall that we want to compute the distance between two datasets, \\(\mathcal{D}_A = \\{x_a, y_a\\}\\) and \\(\mathcal{D}_B = \\{x_b, y_b\\}\\). The authors implement the metric in a demonstration notebook at <https://github.com/tanyang1231/OTCE_Transferability_CVPR21>, though it can be quite straightforwardly computed using any optimal transport library.

Based on the features \\(\boldsymbol{X}\_A\\) and \\(\boldsymbol{X}\_B\\), we can compute the optimal transport plan \\(\boldsymbol{T}^*\\) after discretising our data. In the process, we have computed the Sinkhorn distance \\(\text{OT}\_{\epsilon}\\), where \\(\epsilon\\) is our regularisation parameter chosen for some value. The authors set \\(p=1\\) and so compute this as an estimate of the 1-Wasserstein distance, \\(W_1\\). The authors consider this to be a measure of _domain difference_.

### The Task Difference Score

Where OTCE differs from pure OT and OTDD is how it approaches computing a difference that accounts for the fact these datasets are labelled. Given two labels \\(y_s \in \mathcal{Y}_A\\) and \\(y_t \in \mathcal{Y}_B\\), we can sum over the mass in the estimated optimal transport plan as a measure of the joint probability of the two labels:

$$ \hat{P}(y_a, y_b) = \sum_{i: y^{(i)}_a = y_a}\sum_{j: y^{(j)}_b = y_b} \boldsymbol{T}^{*}_{ij} $$

We can use this joint probability to compute the marginal probability of a given label (NB I am following the paper's exposition, but we could also compute this directly from the transport plan):

$$ \hat{P}(y_a) = \sum_{y_b \in \mathcal{Y}_B}\hat{P}(y_a, y_b) $$

We now have everything we need to compute the conditional entropy (CE) which the authors use as an estimate of _task difference_ which they label \\(W_T\\):

$$ W_T = H(Y_A | Y_B) = H(Y_A, Y_B) - H(Y_A) = - \sum_{y_a \in \mathcal{Y}_A} \sum_{y_b \in \mathcal{Y}_B} \hat{P}(y_a, y_b) \log\frac{\hat{P}(y_a, y_b)}{\hat{P}(y_a)} $$

### The OTCE Measurement

We now have all the components required to compute OTCE, which the authors present as combining a notion of _domain difference_ with a notion of _task difference_. The OTCE is given by:

$$ \text{OTCE}(\mathcal{D}_A, \mathcal{D}_B) = \lambda_{1}\hat{W}_1 + \lambda_{2}\hat{W}_T + b $$

So, the OTCE is a weighted sum of the \\(W_1\\) score as estimated by the Sinkhorn distance, the conditional entropy as computed from the estimated transport plan \\(\boldsymbol{T}^*\\), and an intercept (the authors call this a bias, but I've always hated the use of 'bias' to mean 'intercept' in data science).

### Choosing the OTCE Hyperparameters

One approach to choosing these parameters would be to naively set \\(\lambda_{1}=1\\), \\(\lambda_{2}=1\\), and \\(b=0\\). This would simply weigh the components equally, which has the nice property of being agnostic to the specific setting. This is desirable in many scenarios such as estimating dataset transferability, because if you need to compute transferability to compute the metric, you might as well not bother with the metric.

The authors don't take this approach. Instead, they select a sample of transfer learning tasks, and fit a linear model to estimate the parameters above. As they note, other models such as polynomial could have been used, but sacrifice the appealing simplicity of the above format. They then fit a model, which they claim generalises to any cross-task setting within the same domains.

I admit that I dislike this approach, for two reasons. First, using it to select the hyperparamaters it means the metric is no longer agnostic to the datasets being used, and is sort of cheating when it comes to predicting transferability. We could also fine-tune the OTDD hyperparameters in the same way given the extra parameters in the `otdd` implementation weighing the two distances, but this is not a principled way to construct a distance metric.

Second, for the aforementioned reason that in settings where we want to use OTCE to predict transferability, we already compute transferability in the first place. It might have been useful to report the estimated parameters and then make a recommendation based on them, but the authors don't do this: they suggest fine-tuning to a given domain after performing transferability, which defeats the point of using OTCE!

(The authors do try setting \\(\lambda_{1}=\lambda_{2}=-0.5\\), and \\(b=0\\), and unsurprisingly this reduces the correlation with linear probing transfer success from the high 0.9s to the low 0.7s. This is still respectable! And a more realistic estimate of how you _would_ use a dataset similarity measure and what limitations you'd need to be aware of!)

A final note: not only because of the use of Sinkhorn distance, but also because of the use of cross-entropy which itself is not symmetric, this measure satisfies neither the identity of indiscernibles nor symmetry. OTCE is not therefore a metric, but only a measurement.

### Further Developments: F-OTCE and JC-OTCE

A paper by the original authors of OTCE plus one new author further develops the implementation of the OTCE to develop two new measures: fast-OTCE (F-OTCE) and joint correspondence OTCE (JC-OTCE)[^extra_otce]. The goal of the former is to improve efficiency in computing OTCE, the goal of the latter is to offer greater accuracy when computing the F-OTCE.

The F-OTCE is in very simple, and simply reduces the OTCE to the negative conditional entropy:

$$ \text{F-OTCE} = -H_{\boldsymbol{T}^*}(Y_A | Y_B) $$

Or in other words instead of computing \\(\text{OTCE}(\mathcal{D}_A, \mathcal{D}_B) = \lambda\_{1}\hat{W}_1 + \lambda\_{2}\hat{W}_T + b\\), just computes \\(\hat{W}_T\\). The motivation for this is a result that shows the negative conditional entropy lower bounds empirical transfer success[^nce_lower_bound] (interestingly the paper with this result was published 2 years before the OTCE paper, but I haven't spent time trying to work out if it inspired the OTCE or if this is a case of two separate teams landing on a similar idea independently).

This is only fast in that it avoids performing fine-tuning to find \\(\lambda_{1}\\), \\(\lambda_{2}\\), and \\(b\\). If we choose a principled approach to computing these, there is no real speed gain at all.

The JC-OTCE is more interesting and builds on both F-OTCE and OTDD. In short, similar to OTDD (and, in fact, explicitly inspired by it) it is based on implementing a cost function between feature-label pairs \\(\left(x,y\right)\\), then computing the optimal transport problem using this cost function. Recall that \\(P_y\\) describes the distribution of features under the label y. The authors set as their cost function a version of the cost function in OTDD:

$$ d_{\mathcal{Z}}((x,y), (x',y')) = \gamma \|x - x'\|_{2}^{2} + (1-\gamma)\text{OT}(P_{y}, P_{y'})^p $$

where the the main differences are first the explicit choice of \\(d_{\mathcal{X}}\\), and second the \\(\gamma \in \left[0,1\right]\\) parameter, which they set as 0.5.

As before, the optimal transport plan is computed using the sinkhorn algorithm and the estimated optimal transport plan \\(\boldsymbol{T}_{OTDD}^{*}\\) is extracted. Where this differs from OTDD is the authors then as in F-OTCE use this to compute the negative conditional entropy, which serves as their dataset distance estimate:

$$ \text{JC-OTCE} = -H_{\boldsymbol{T}_{OTDD}^{*}}(Y_A | Y_B) $$

## Towards Optimal Transport on Non-Toy Datasets

At this point, we've defined four methods of computing optimal transport: the one-dimensional case, the sliced Wasserstein, the \\(W_2\\) when our distributions are gaussian, and the discrete solution to optimal transport. We have also defined five dataset similarity metrics based on optimal transport: OTDD, s-OTDD, OTCE, F-OTCE, and JC-OTCE. However, much of the extant literature developing these metrics has focussed on relatively toy datasets (OTCE is an honourable exception).

### Labelled vs Unlabelled

All five of these metrics have been developed with the goal of explicitly incorporating labels into the distance measurement. This makes sense when we care about transfer learning success or checking whether a test set is good for our train set (or vice versa), are performing supervised learning, and we have labels for both. If we are performing unsupervised learning, then we can just switch to regular OT, or one of the myriad other dataset similarity metrics which are label-agnostic (e.g. MMD).

One scenario, briefly noted above in the discussion the fact the OTDD authors implemented clustering as a means of producing labels, is when we want to measure the distance between a labelled and an unlabelled dataset. The same method could enable comparison of unlabelled datsets via OTDD and OTCE and their derivatives, but I think this is the more interesting scenario. This would, however, further hyperparameterise the metrics with a choice of clustering algorithm and its hyperparameters. And we would need to evaluate how successful this across different settings.

### Shared Feature Spaces

All of these metrics share some crucial limitations. First, they assume a shared feature space. This is true of the toy datasets typically worked on (e.g. transferring between MNIST and EMNIST), but this assumption is highly unrealistic. The OTDD authors note that this can be relaxed by using something called the Gromov-Wasserstein distance[^gromov_wasserstein], which does not require a shared feature space between distributions. But this doesn't go far enough: in realistic settings, there is often no shared features space _within_ datasets. Consider two image datasets sampled from realistic distributions: the images will not be of the same dimensions.

So, as implemented in OTDD (and our previous work on dataset similarity[^exact_labels]), using embeddings is not longer only a means for trying to extract semantic information, but also a principled way of projecting different images into the same dimensions. This also offers a neat way for vectorising things like text and moving beyond the image setting. But, as with clustering, it also further parameterises the metrics, and using a given embedding model with a given metric becomes its own metric (e.g. SIGLIP + exact OTDD is one metric, CLIP + exact OTDD another, etc).

### Scaling Properties

Another problem likely to arise on realistic datasets is scale. When we represent datasets as sums of Dirac delta functions, the size of the optimal transport scales with \\(N_1\\) and \\(N_2\\), and badly. The authors of OTDD and other approaches deal with this by limiting the number of possible samples. One experiment worth performing is examining how the OTDD performs as an estimator as the subsample size changes, bearing in mind both total dataset size but also the number of classes and class imbalance.

## Addendum: Other Uses of Optimal Transport in Applied Data Science

The focus of this blog is, based on my needs, on dataset similarity. But a final note that optimal transport arises in many settings in data science:

- **Earth Mover's Distance (EMD):** This is another name for \\(W_1\\)[^emd]. This finds specific applications in the **Word Mover's Distance** (WMD), which combines word embeddings and the EMD to produce a notion of document distance[^wmd].
- **Fréchet Inception Distance (FID):** This is a metric for computing the quality of a set of images from a generative model (such as a GAN) and a real set of images. It is computed by using Inception to embed the images, then computing the Gaussian \\(W_2\\) between them[^fid].
- The Sinkhorn divergence was itself developed as a loss function for learning generative models. This is why it (and the Sinkhorn distance) was implemented in the `geomloss` library in Python.
- **Wasserstein GAN (WGAN):** The Wasserstein distance itself has been used as a loss function in learning GANs.
- **Flow matching:**: Diffusion models can be thought of as learning an optimal transport map between noise and an output data distribution.
- OT metrics, including JDOT and OTDD, can be used to align source and target distributions for transfer learning -- this is what I understand the authors of OTDD to have been doing in their second paper, at any rate.

---

## Footnotes

[^cot]:
    Peyré, G. and Cuturi, M. (2020) _Computational Optimal Transport_. DOI: <https://doi.org/10.48550/arXiv.1803.00567> [Also hosted on GitHub at <https://optimaltransport.github.io/pdf/ComputationalOT.pdf>. I'm not sure which is the most up to date version.]

    Though Wikipedia also has a number of good pages on various aspects of the topic:
    - <https://en.wikipedia.org/wiki/Transportation_theory_(mathematics)>
    - <https://en.wikipedia.org/wiki/Wasserstein_metric>
    - <https://en.wikipedia.org/wiki/Linear_programming>

[^infimum]:
    The term \\(\inf\\) stands for _infimum_ and is very closely related to the idea of _minimum_. The infimum of a set is the lower bound of that set, while the minimum of a set is the smallest value _inside_ that set. Consider the following two sets:

    1. (0,1)
    2. [0,1]

    The first set has 0 as a lower bound, but does not contain 0. 0 is therefore the infimum of that set, but the set does not have a minimum, because we can always move a little closer to 0 without reaching 0. The second set also has 0 as a lower bound but _contains_ 0, so 0 is both the minimum and the infimum of that set. The infimum of a set therefore always exists whereas the minimum does not, so it is more _precise_ to say we find the infimum, in a formula like the above, but if you think of it as finding the smallest possible value you will not go wrong.

[^kantorovich]: The political history of his work on optimal transport is itself fascinating, and I highly recommend the semi-fictional account told in _[Red Plenty](https://www.faber.co.uk/product/9780571225248-red-plenty/)_ by Francis Spufford. I say semi-fictional because of how the book is based on the real story, and blends fiction with non-fiction writing. The book itself is a wider story of how and why efforts at efficient allocation in the USSR failed, and a good review is available from Slate Star Codex at <https://slatestarcodex.com/2014/09/24/book-review-red-plenty/>.

[^translocation]: Kantorovich, L.V. (2006) On the Translocation of Masses, _Journal of Mathematical Sciences_ 133 (4). URL: <https://www.math.toronto.edu/mccann/assignments/477/Kantorovich42.pdf> [English reprint of original 1942 article]

[^continuous_case]:
    This strikes me as a very important fact, but one which often turns out to be missing from many textbooks and introductory treatments of optimal transport and transportation theory, reflecting the fact that the intended audiences are usually mathematics rather than applied data science or statistics audiences. The first paper I found in which this is actually noted is

    Wang, J., Wang, P. and Shafto, P. (2023) Efficient Discretization of Optimal Transport, _Entropy_ 25 (6). DOI: <https://doi.org/10.3390/e25060839>

[^kantorovich_again]: Seriously, read _Red Plenty_, it's a fascinating read both for its content and form.

[^sinkhorn]: Cuturi, M. (2013) Sinkhorn Distances: Lightspeed Computation of Optimal Transport, _NIPS'13: Proceedings of the 27th International Conference on Neural Information Processing Systems - Volume 2_. DOI: <https://dl.acm.org/doi/proceedings/10.5555/2999792> [Preprint available at <https://doi.org/10.48550/arXiv.1306.0895>]

[^sinkhorn_divergence]: Genevay, A., Peyré, G. and Cuturi, M. (2018) Learning Generative Models with Sinkhorn Divergences, _International Conference on Artificial Intelligence and Statistics_. URL: <https://proceedings.mlr.press/v84/genevay18a.html>. [Preprint available at <https://doi.org/10.48550/arXiv.1706.00292>]

[^otdd]:
    Alvarez-Melis, D. and Fusi, N. (2020) Geometric Dataset Distances via Optimal Transport, _Advances in Neural Information Processing Systems_. DOI: <https://dl.acm.org/doi/proceedings/10.5555/3495724> [Preprint available at <https://doi.org/10.48550/arXiv.2002.02923>]

    Alvarez-Melis, D. and Fusi, N. (2020) Measuring dataset similarity using optimal transport, _Microsoft Research Blog_. URL: <https://www.microsoft.com/en-us/research/blog/measuring-dataset-similarity-using-optimal-transport/>

[^jdot]: Courty, N. et al. (2017) Joint Distribution Optimal Transportation for Domain Adaptation, _NIPS'17: Proceedings of the 31st International Conference on Neural Information Processing System_. DOI: <https://dl.acm.org/doi/proceedings/10.5555/3294996> [Preprint available at <https://doi.org/10.48550/arXiv.1705.08848>]

[^jdot_mention]: Alvarez-Melis, D. and Fusi, N. (2021) Dataset Dynamics via Gradient Flows in Probability Space, _Proceedings of the 38th International Conference on Machine Learning_. URL: <https://proceedings.mlr.press/v139/alvarez-melis21a.html>. [Preprint available at: <https://doi.org/10.48550/arXiv.2010.12760>]

[^exact_labels]: When we used this codebase for [a project](https://www.turing.ac.uk/sites/default/files/2024-04/arc_model_similarity_2.pdf) (github [here](https://github.com/alan-turing-institute/arc-model-similarities-phase-2)) during 2022/2023, for some reason the exact computation proved faster than the approximate. Now I'm doing this deep dive, I do wonder if this is because we kept the default option for the method of computing the square root matrices in the gaussian approximation as `sqrt_method="spectral"`, though I honestly don't remember if we tried tweaking this or not. Do with this information what you will.

[^sotdd]: Nguyen, K., Nguyen H., Pham T. and Ho N. (2025) Lightspeed Geometric Dataset Distance via Sliced Optimal Transport, _arXiv preprint_. DOI: <https://doi.org/10.48550/arXiv.2501.18901>

[^moments]: See <https://en.wikipedia.org/wiki/Moment_(mathematics)>

[^default_k_sottd]: See <https://github.com/hainn2803/s-OTDD/blob/main/otdd/pytorch/sotdd.py#L238>

[^otce]: Tan, Y., Li, Y. and Huang, S.L. (2021) OTCE: A Transferability Metric for Cross-Domain Cross-Task Representations, _Proceedings of the IEEE/CVF Conference on Computer Vision and Pattern Recognition (CVPR)_. URL: <https://openaccess.thecvf.com/content/CVPR2021/html/Tan_OTCE_A_Transferability_Metric_for_Cross-Domain_Cross-Task_Representations_CVPR_2021_paper.html> [Preprint available at: <https://doi.org/10.48550/arXiv.2103.13843>]

[^extra_otce]: Tan, Y. et al. (2025) Transferability-Guided Cross-Domain Cross-Task Transfer Learning, _IEEE Transactions On Neural Networks and Learning Systems_ 36 (2). DOI: <https://doi.org/10.1109/TNNLS.2024.3358094> [Preprint available at <https://doi.org/10.48550/arXiv.2207.05510>]

[^nce_lower_bound]: Tran, A., Nguyen, C. and Hassner, T. (2019) Transferability and Hardness of Supervised Classification Tasks, _2019 IEEE/CVF International Conference on Computer Vision (ICCV)_. DOI: <https://doi.org/10.1109/ICCV.2019.00148> [Preprint available at <https://doi.org/10.48550/arXiv.1908.08142>]

[^gromov_wasserstein]:
    See COT in the first footnote, or one of:

    Mémoli, F. (2014) The Gromov–Wasserstein Distance: A Brief Overview, _Axioms_ 3 (3). DOI: <https://doi.org/10.3390/axioms3030335>

    Hua, D. (2023) An Introduction to Gromov-Wasserstein Distances.. URL: <https://web.math.ucsb.edu/~kcraig/math/OTReadingSeminar_files/Lecture9_Hua.pdf> [Seminar notes]

    Note that I haven't read further into Gromov-Wasserstein, so cannot make recommendations between these three. My main, very loose, understanding is that rather than leveraging a notion of pointwise distance, they leverage inner structure within the dataset. YMMV.

[^emd]: The relevant Wikipedia page has some interesting notes on variants among other stuff: <https://en.wikipedia.org/wiki/Earth_mover%27s_distance>

[^wmd]: Kusner, M.J. (2015) From word embeddings to document distances, _ICML'15: Proceedings of the 32nd International Conference on Machine Learning_. URL: <https://dl.acm.org/doi/10.5555/3045118.3045221>

[^fid]: This is nicely described on the relevant Wikipedia page: <https://en.wikipedia.org/wiki/Fr%C3%A9chet_inception_distance>
