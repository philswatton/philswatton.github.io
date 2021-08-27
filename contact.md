---
layout: default
title: Contact
css: default.css
---

I'm always open to a conversation about my research, your research, elections (especially UK elections), R programming, or anything else that's interesting!

If you'd like to talk to me, feel free to reach out via one of the following mediums:

{% for item in site.data.contact %}
- {{ item.social }}: [{{ item.text }}]({{ item.link }})
{% endfor %}