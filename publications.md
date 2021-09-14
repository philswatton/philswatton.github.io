---
layout: default
title: Papers
subtitle: Last updated 27/08/2021
css: default.css
---

This page contains a complete list of the papers I've been working on. If instead you'd like to see an explanation of my research, you can do so at my [research](/research) page. I'm always open to collaborations and questions so if you'd like to work with me or have questions about my own work, please feel free to get in touch.

## Working Papers
{% for item in site.data.working %}
- {{ item.authors }} ({{ item.year }}) "{{ item.title }}" {% if item.pdf != nil %} <a href="{{ item.pdf }}">PDF</a> {% endif %}
{% endfor %}

## Works in Progress
{% for item in site.data.wip %}
- {{ item.authors }} "{{ item.title }}"
{% endfor %}