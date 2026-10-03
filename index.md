---
layout: default
title: Home
---
<figure>
  <img src="/assets/images/me_nobg.png" class="profile">
</figure>

Hello, I'm Phil. Welcome to my website!

I'm a Senior Data Scientist at the Alan Turing Institute. In my job, I work on applied research projects on or adjacent to deep learning. Prior to this, I obtained a PhD Government from the University of Essex where I worked on public opinion, elections, and political methodology.

Sorted alphabetically, I'm passionate about board games, books, computer games, computer programming, data science, history, philosophy, politics, statistics, and Warhammer 40,000. I'm currently trying to add going to the gym and walks (back) to that list.

I use this site to collect in a single space my research, writing, and other projects.

<div class="box">
  <p class="box-title">CV</p>
  <div class="box-content">
    <p>Academic CVs are different to regular CVs and are essentially glorified lists. For this reason, I maintain two CVs for applying to different kinds of position. Feel free to read one or both:</p>

    <div class="cv-div">
        <a href="Phil_Swatton_Industry_CV.pdf">Regular CV</a>
        <a href="Phil_Swatton_Academic_CV.pdf">Academic CV</a>
    </div>
  </div>
</div>

<div class="box">
  <p class="box-title">Latest Blog Posts</p>
  <div class="box-content">
    {% assign counter = 0 %}
    {% for post in site.posts %}
      {% if post.categories contains 'archive' %}
      {% else %}
        {% if counter < 3 %}
          {% include post_card.html %}
          {% assign counter = counter | plus: 1 %}
        {% endif %}
      {% endif %}
    {% endfor %}
  </div>
</div>

<div class="box">
  <p class="box-title">Contact</p>
  <div class="box-content">
    <p>If you'd like to get in touch, you can:</p>
    <ul>
      <li>Bloop (?) me at <a href="https://bsky.app/profile/philswatton.bsky.social">@philswatton.bsky.social</a></li>
      <li>Find me on substack at <a href="https://philswatton.substack.com/">@philswatton</a>, or subscribe to my publication <a href="https://dysfunctionalprogramming.substack.com/">Dysfunctional Programming</a></li>
      <li>Email me at <a href="mailto:pswatton@turing.ac.uk">pswatton@turing.ac.uk</a> (preferably work-related stuff only please)</li>
      <li>Message me on LinkedIn at <a href="https://www.linkedin.com/in/philswatton/">Phil Swatton</a></li>
      <li>Browse my publications on <a href="https://scholar.google.co.uk/citations?user=mbxIgHAAAAAJ&hl=en&oi=ao">my Google Scholar profile</a></li>
      <li>Browse my code on GitHub at <a href="https://github.com/philswatton">https://github.com/philswatton</a></li>
    </ul>
  </div>
</div>

