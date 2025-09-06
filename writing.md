---
layout: default
title: writing
---

# Writing

## Dysfunctional Programming

[Dysfunctional Programming](https://dysfunctionalprogramming.substack.com/) is my substack. I am still in the process of defining what I'll do with this, having written two posts for it then immediately neglected it. It will probably act primarily as a place for longer-form content not appropriate for the blog on this website.

## Other Writing

Other writings published outside of my substack and blog.

{% for paper in site.data.writing reversed %}
{% include research_card.html %}
{% endfor %}
