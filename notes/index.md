---
layout: default
title: Notes
---

# Notes

All notes:

<!-- {% assign pages = site.pages | where_exp: "page", "page.url contains 'notes'" | where_exp: "page", "page.title != 'Notes'" %} -->
{% assign pages = site.pages
   | where_exp: "page", "page.url contains '/notes/'"
   <!-- | where_exp: "page", "page.dir == '/notes/' or page.name == 'index.md'" -->
   | where_exp: "page", "page.title != 'Notes'" %}
{% for page in pages %}
<a href="{{page.url}}">{{page.title}}</a>
{% endfor %}


