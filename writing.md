---
layout: default
title: writing
---

# Writing

## Dysfunctional Programming

[Dysfunctional Programming](https://dysfunctionalprogramming.substack.com/) is my substack. I am still in the process of defining what this is for, but it seems to be converging towards being a place for long-read essays I'd like to reach a slightly wider audience than this website.

## Published Writing

Various pieces of writing I've produced or contributed to beyond my research, writing on this website, or substack.

{% for paper in site.data.writing reversed %}
{% include research_card.html %}
{% endfor %}
