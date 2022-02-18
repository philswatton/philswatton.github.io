---
layout: default
title: research
subtitle: Last updated 22/11/2021
css: page.css
---

This page contains a complete list of the papers I've been working on. I'm always open to collaborations and questions so if you'd like to work with me on a project or have questions about my own work, please feel free to get in touch via one of the mediums listed on my [contact page](/contact).

## Working Papers
{% for item in site.data.working %}
- {{ item.authors }} ({{ item.year }}) "{{ item.title }}" {% if item.pdf != nil %} <a href="{{ item.pdf }}">PDF</a> {% endif %}
{% endfor %}

## Works in Progress
{% for item in site.data.wip %}
- {{ item.authors }} "{{ item.title }}"
{% endfor %}