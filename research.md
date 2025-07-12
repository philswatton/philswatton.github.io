---
layout: default
title: writing
---
# Research
<p class="update-notice"><em>Last updated 09/07/2025</em></p>

I'm lucky enough to do research for living, currently as a Data Scientist and previously as a PhD student in political science. I still try to publish in political science when my spare time allows. This page lists my published research and working papers, with work conducted across the fields of political science, data science, and artificial intelligence. "Published" here means a mix of peer-reviewed journal articles, technical reports, and research reports. This page is usually the most up to date list of my research, but you can also visit my [google scholar profile](https://scholar.google.co.uk/citations?user=mbxIgHAAAAAJ&hl=en&oi=ao).


## Publications

{% for paper in site.data.research.published reversed %}
{% include research_card.html %}
{% endfor %}


## Working Papers

{% for paper in site.data.research.working %}
{% include research_card.html %}
{% endfor %}


## PhD Thesis

My PhD thesis is titled <strong>Three Essays on the Measurement of Political Ideology</strong>. It has three component papers:

1. Agree to Agree: Correcting Acquiescence Bias in the Case of Fully Unbalanced Scales with Application to UK Measurements of Political Beliefs
2. Age Isn't Just a Number:  A Comparative Age-Period-Cohort Analysis of Political Beliefs in Europe
3. Social Democratic Party Positions on the EU: The Case of Brexit

<div class="research-links">
    <a href="https://repository.essex.ac.uk/35479/" class="item-link">Link</a>
    <a href="https://repository.essex.ac.uk/35479/1/thesis.pdf" class="item-link">PDF</a>
</div>
