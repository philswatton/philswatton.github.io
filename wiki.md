---
layout: default
title: Garden
---

# Personal Wiki

> So long as I remain alive and well I shall continue to feel strongly about prose style, to love the surface of the earth, and to take a pleasure in solid objects and scraps of useless information. It is no use trying to suppress that side of myself.
> <span class="quote-author">George Orwell, _[Why I Write](https://www.orwellfoundation.com/the-orwell-foundation/orwell/essays-and-other-works/why-i-write/)_</span>

{% for cat in site.data.wiki_categories %}
<h2>{{ cat.name }}</h2>
{% for wp in site.wiki %}
{% if wp.category == cat.slug %}
- <p class="note-link"><a href="{{wp.url}}">{{wp.title}}</a></p>
{% endif %}
{% endfor %}
{% endfor %}
