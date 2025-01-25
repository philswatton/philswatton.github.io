---
layout: default
title: writing
---

# Writing

## Dysfunctional Programming

[Dysfunctional Programming](https://dysfunctionalprogramming.substack.com/) is my substack. I am still in the process of defining what I'll do with this. At the moment, the plan is to post two kinds of content here. First, every two weeks I intend to share a reading list of highlights from the past two weeks. Second, I intend post longform reads on topics where I draw on my research experience to comment on topics of general interest.

## Other Writing

Other writings published outside of my substack and blog.

{% for paper in site.data.writing reversed %}
{% include research_card.html %}
{% endfor %}
