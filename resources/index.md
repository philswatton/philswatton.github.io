---
layout: default
title: resources
---

# Resources

This page largely collects miscellaneous content that doesn't otherwise belong on any of the other pages on this website. Some is my creation, some links to the creations of others which I've found fun, interesting, and/or useful.

## Code

The following is two pieces of WIP that I may or may not get around to finishing one day.

<div>
    <h3>R Model Codes</h3>
    <p>A WIP bookdown website containing R implementations of various statistical models, data reduction methods, and machine learning algorithms. Currently neglected, but I'm hoping to return to it when I find myself with a nice stretch of spare time in front of me.</p>
    <div>
        <a href="https://philswatton.github.io/Collected-R-Code/" class="item-link">Link</a>
        <a href="https://github.com/philswatton/Collected-R-Code" class="item-link">GitHub</a>
    </div>
</div>

<div>
    <h3>Neural Networks by Hand</h3>
    <p>A WIP jupyter book containing my self-learning notes on neural networks from when I first started as a data scientist. Covers gradient descent, vector/matrix calculus, forward passes/propagation, backward passes/propgation, activation and cost functions. Contains a Python implementation of a feedforward neural network, which allows for arbitary depth, layer width, several activation and cost functions. Mostly finished, though I'm not sure I'll get back to it.</p>
    <div>
        <a href="https://philswatton.github.io/neural-networks-by-hand/" class="item-link">Link</a>
        <a href="https://github.com/philswatton/neural-networks-by-hand" class="item-link">GitHub</a>
    </div>
</div>

## Good Reads

Some fun or interesting reads deserving of a wider readership.

- [The Witness](https://web.mit.edu/allanmc/www/borges.thewitness.pdf) - Jorge Luis Borges (1967)
- [What the Tortoise Said to Achilles](/assets/pdfs/What the Tortoise Said to Achilles.pdf) - Lewis Carroll (1895)
- [R : Past and Future History](https://cran.r-project.org/doc/html/interface98-paper/paper.html) - Ross Ihaka (1998) [[PDF Version](https://www.stat.auckland.ac.nz/~ihaka/downloads/Interface98.pdf)]
- [PEP 20 - The Zen of Python](https://peps.python.org/pep-0020/) - Tim Peters (2004)
- [Is It O.K. To Be A Luddite?](https://archive.nytimes.com/www.nytimes.com/books/97/05/18/reviews/pynchon-luddite.html) - Thomas Pynchon (1984)
- [The Tyranny of Time](https://www.noemamag.com/the-tyranny-of-time/) - Joe Zadeh (2021)

## Links

Websites and webpages I return to again and again either because they are incredibly useful or because I enjoy them.

- [Stanford Encyclopedia of Philosophy](https://plato.stanford.edu/)

## Media

A journalist interviewed me once about deepfakes and I was quoted twice in the subsquent article, so that justifies the existence of this section.

- ['This Isn't Funny Anymore': AI Deepfakes Are Stealing Millions Every Year — and These Entrepreneurs Are Racing to Stop Them](https://www.entrepreneur.com/science-technology/ai-deepfakes-are-stealing-millions-every-year-whos/494361), Entrepreneur Magazine

## Notes

Notes on topics that don't really belong as full research papers. Hopefully useful to someone, somewhere.

{% for paper in site.data.research.notes %}
{% include research_card.html %}
{% endfor %}

