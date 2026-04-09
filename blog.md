---
layout: default
title: Blog
---

# Blog

[Organised by tags](/tags)

Like anyone else, I'm just trying to make sense of the planet I've found myself on and the universe I've found myself in. This blog collects various write-ups and thoughts from my reading and research, along with other miscellanea. Most of these are from my spare time and so represent no expertise other than curiosity, others are however drawn from my working life and are better informed. Most of them were written for my own purposes, a couple of them to amuse my wife.

Since the topics reflect my own interests at different points in time, they can be rather eclectic. You'll probably be well-served to follow the link above to get the blog organised by tags as this will better enable you to find those most relevant to you, or to visit the page for a specific tag.

## Posts

{% for post in site.posts %}
{% if post.categories contains 'archive' %}
{% else %}
{% include post_card.html %}
{% endif %}
{% endfor %}

## Archived Posts

I have a bad habit of deleting, or taking offline, blogs and blog posts I am no longer satisfied with for one reason or another. To try and beat this habit, I'm making archived posts from this site's blog available, so that I still have a mechanism for removing posts whose quality I am no longer satisfied with without permanently deleting them. You can find them here: [blog archive](/archive).
