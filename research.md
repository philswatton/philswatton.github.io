---
layout: default
title: writing
---
# Research
<p class="update-notice"><em>Last updated 25/11/2024</em></p>

I'm lucky enough to do research for a living, previously as a PhD student and now as a Data Scientist. This page lists my publications, with work conducted across the fields of political science, data science, and artificial intelligence. I do my best to keep this page up to date, but for a list that's more likely (though not guaranteed) to be current I recommend visiting my [google scholar profile](https://scholar.google.co.uk/citations?user=mbxIgHAAAAAJ&hl=en&oi=ao).


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

<a href="https://repository.essex.ac.uk/35479/" class="item-link">Link</a>


<!-- 

<div>
    <h2>Other Writing</h2>
    
    <ol class="research-list">
        {% for paper in site.data.research.writing %}
        <li>
            <div class="project-div">
                <h3>{{ paper.title }}</h3>
                <p>{{ paper.authors }} ({{ paper.year }})</p>
                <div>
                    {% if paper.link != nil %}<a href="{{ paper.link }}" class="item-link">Link</a>{% endif %}
                    {% if paper.pdf != nil %}<a href="{{ paper.pdf }}" class="item-link">PDF</a>{% endif %}
                </div>
            </div>
        </li>
        {% endfor %}
    </ol>
</div>

 -->
