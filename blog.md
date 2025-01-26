---
layout: default
title: Blog
---

# Blog

This page presents all blog posts hosted on this website. You can view a version of this page where posts are sorted by their tags [at this link](/tags.html).

## Posts

{% for post in site.posts %}
{% if post.categories contains 'archive' %}
{% else %}
{% include post_card.html %}
{% endif %}
{% endfor %}

## Archived Posts

I have a bad habit of deleting, or taking offline, blogs and blog posts I no longer like. Several times, I've started a blog, only to be dsissatisfied with its contents and take them down. To try and beat this habit, I'm making archived posts from this site's blog available. You can find them here: [blog archive](/archive.html).
