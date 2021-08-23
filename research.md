---
layout: default
title: Research
css: research.css
---
# Research

My thesis sits in the broad realms of public opinion, elections, and quantiative research methods, with particular emphasis on the broad intersection between these areas. Specifically, I work on the implications of the second dimension for political behaviour and electoral strategy, its relationship with voter demographics, measurement methods for political beliefs, and simulation methods for electoral analysis.

My thesis will take on a papers rather than monograph format and thus does not have a single overarching argument, but rather possesses these broad unifying themes. I chose this format largely because I found the freedom to choose projects without the constraint of needed to fit within a wider argument to be deeply appealing.

Two of my thesis papers are in the working paper stage and will hopefully soon be entering the submissions process and respectively examine the relationship between age and political beliefs, and the problem of acquiescence bias for measuring political beliefs. The third will argue that the Labour party's best available strategy in the 2019 general election was to be a remain party.

In my thesis and my other work I use a wide range of quantitative research methods including but not limited to multilevel modeling, age-period-cohort analysis, confirmatory factor analysis, simulation, and multilevel regression with postratification. I enjoy the challenges involved in learning and applying statistical methods and hope to do more work in this field. I also particularly enjoy working with the R programming language and have been teaching R since summer last year. In the longer term, I hope to start learning how to write and implement my own R packages, and to incorporate Python in my work where appropriate.

<hr>

## Working Papers
{% for item in site.data.working %}
#### {{ item.title }}
{% if item.coauthor != nil %}With {{ item.coauthor }} ({{ item.couni}}).{% endif %}

{{ item.desc }}
{% endfor %}

<hr>

## Work in Progress
{% for item in site.data.wip %}
#### {{ item.title }}
{% if item.coauthor != nil %}*With {{ item.coauthor }} ({{ item.couni}})*.{% endif %}

{% if item.desc != nil %}{{ item.desc }}{% endif %}
{% endfor %}
