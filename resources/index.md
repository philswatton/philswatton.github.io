---
layout: default
title: resources
---

# Resources

Some resources that I've either made myself or found useful.

## Code

<div>
    <h3>R Model Codes</h3>
    <p>A WIP bookdown website containing R implementations of various statistical models, data reduction methods, and machine learning algorithms. Currently a little neglected, but I'm hoping to return to it after finishing my thesis corrections.</p>
    <div>
        <a href="https://philswatton.github.io/Collected-R-Code/" class="item-link">Link</a>
        <a href="https://github.com/philswatton/Collected-R-Code" class="item-link">GitHub</a>
    </div>
</div>

<div>
    <h3>Neural Networks by Hand</h3>
    <p>A WIP jupyter book containing my self-learning notes on neural networks. Will cover gradient descent, vector/matrix calculus (assumes prior knowlefge of linear algebra), forward passes/propagation, backward passes/propgation, activation and cost functions when done. Contains a Python implementation of a feedforward neural network, which allows for arbitary depth, layer width, several activation and cost functions. Currently being worked on.</p>
    <div>
        <a href="https://philswatton.github.io/neural-networks-by-hand/" class="item-link">Link</a>
        <a href="https://github.com/philswatton/neural-networks-by-hand" class="item-link">GitHub</a>
    </div>
</div>

## Notes

{% for paper in site.data.research.notes %}
{% include research_card.html %}
{% endfor %}

