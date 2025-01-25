---
layout: default
title: Tags
---

# Tags

{% assign sortedTags = site.tags | sort %}
{% for tag in sortedTags %}
 <h2>{{ tag[0] }}</h2>

  {% for post in tag[1] %}
  <!-- {% if post.categories contains 'archive' %} -->
  <!-- {% else %} -->
  {% include post_card.html %}
  <!-- {% endif %} -->
  {% endfor %}

{% endfor %}