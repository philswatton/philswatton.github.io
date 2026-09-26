---
layout: default
title: Garden
---

# Digital Garden

> So long as I remain alive and well I shall continue to feel strongly about prose style, to love the surface of the earth, and to take a pleasure in solid objects and scraps of useless information. It is no use trying to suppress that side of myself.
> <span class="quote-author">George Orwell, _[Why I Write](https://www.orwellfoundation.com/the-orwell-foundation/orwell/essays-and-other-works/why-i-write/)_</span>

{% assign garden_pages = site.pages | where_exp: "page", "page.url contains '/garden/'"
   | where_exp: "page", "page.dir == '/garden/' or page.name == 'index.md'"
   | where_exp: "page", "page.title != 'Garden'" %}
{% for gp in garden_pages %}
- <p class="note-link"><a href="{{gp.url}}">{{gp.title}}</a> (Last Updated: {{gp.updated | date_to_string}})</p>
{% endfor %}
