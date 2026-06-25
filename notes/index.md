---
layout: default
title: Notes
---

# Notes

> So long as I remain alive and well I shall continue to feel strongly about prose style, to love the surface of the earth, and to take a pleasure in solid objects and scraps of useless information. It is no use trying to suppress that side of myself.
> <span class="quote-author">[George Orwell](https://en.wikipedia.org/wiki/George_Orwell), _[Why I Write](https://www.orwellfoundation.com/the-orwell-foundation/orwell/essays-and-other-works/why-i-write/)_</span>

{% assign pages = site.pages | where_exp: "page", "page.url contains '/notes/'" %}
{% assign pages = pages | where_exp: "page", "page.dir == '/notes/' or page.name == 'index.md'" %}
{% assign pages = pages | where_exp: "page", "page.title != 'Notes'" %}
{% for page in pages %}
- <p class="note-link"><a href="{{page.url}}">{{page.title}}</a> (Last Updated: {{page.updated}})</p>
{% endfor %}


