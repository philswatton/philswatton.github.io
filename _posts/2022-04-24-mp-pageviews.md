---
layout: post
title: Which of the 2019 MPs had the most Wikipedia pageviews this far into 2022?
css: page.css
---

According to Wikipedia's page on Wikipedia[^1], Wikipedia is the most-read reference work in history, contains about 58 million articles, and as of this year is the 10th most popular website according to Alexa (an Amazon subsidiary but afaik unrelated to the home assistant). It's also a growing source of secondary data for social scientific research.

While most readers will primarily be reading the unstructured text on a given Wikipedia page, one of its most useful components from a research perspective is the structured data on the page. When data on a website is presented in such a systematic way across several pages, it's possible to exploit that structure to webscrape the data.

Equally as interesting as the secondary data that Wikipedia collates and organises is the user data associated with its pages. As unsubtly declared by the title of this blog post, one example would be page views for its content. If interest is in a particular set of pages, it becomes possible to compare the view counts for the pages or to use said counts in more sophisticated analyses.

In the particular case of this blog post, I'm inspired by a tweet plotting out the page view counts for Canadian MPs[^2]. I decided to produce a similar plot to the one in the tweet, except using UK MPs instead. I also decided it would be more interesting to use the top 50 most-visited instead of just the party leaders. 

## Legislator Data

Before plotting, I needed the page view data for each of the MPs. I took as my starting point the `legislatoR` R package[^3], which is an interface to the Comparative Legislators Database. For my purposes, this contains both useful data on MPs including their political party and the title of their Wikipedia page. One thing worth saying up-front though is that this data will contain information on the original make-up of the 2019 parliament. So things like by-elections, or changes in party won't have made it in. In that respect, the resultant plot will be the most-searched MPs elected in 2019 in 2022.

```
uk_core <- get_core("gbr")
uk_political <- get_political("gbr")
mps <- left_join(uk_core, uk_political, by=c("pageid"="pageid")) %>%
  filter(session_start == "2019-12-12") %>%
  select(name, wikititle, sex, ethnicity,  
         religion, party, constituency)
```

## Wikipedia data

With the MP's data and Wikipedia titles ready, the next step was to use Wikimedia's API (application programming interface) to obtain page view data. If you're unfamiliar with the concept of an API, the TLDR is that it's a type of software that lets two other softwares speak to each other. One good example is google search - it takes the input you give it, passes on the request to google's server, then returns the output of that request to you.

The second reason that google search is a good example is it's a particular type of API called a RESTful API. You've probably seen how the URL on the search results changes depending on what you put into the search bar. In fact, if you edit this URL yourself, you'll change the search results as though you'd put a new query in the search bar. This is because RESTful APIs use URLs to do their work.

The Wikimedia API I used to obtain pageview data for the MP's pages is a type of restful API. You can get the link for its documentation in the footnotes[^4]. Once you've understood the documentation, it isn't too difficult to construct the URL to obtain data from the API.

```
wiki_api <- function(title) {

  # Construct api query
  query <- str_c("https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/en.wikipedia/all-access/all-agents/",
                 title,
                 "/daily/2022010100/2022042300")

  # GET request
  response <- GET(query)

  # Convert output to dataframe
  out <- rawToChar(response$content) %>%
    fromJSON() %>%
    `[[`("items")

  # Sleep
  Sys.sleep(10)

  # Return
  return(out)

}
```

The quick explanation of the R function above is that it starts by generating the relevant URL for the MP's page view data using the page's Wikipedia title. The `/daily/2022010100/2022042200` at the end says that I want daily data, starting from the first of January of this year and going up until the 23rd of April[^5]. Using the `httr` R package it makes a GET request (a type of request for information to the RESTful API). The output will come in a JSON data format, so I used the `jsonlite` R package to parse it into a dataframe format.

## Treemap

With the dataframe prepared, the only thing left to do is make the plot. To do this, I used the `treemap` R package[^6]. A treemap is essentially a method of plotting hiearchical data. In this case, we have MPs nested inside political parties, and we want to organise the page view counts by party.

```
treemap(df,
        c("party2","name2"),
        vSize="views",
        type="color",
        vColor="color",

        border.col="#FFFFFF",
        border.lwds=c(16,6),

        title="UK MP Wikipedia Page Views by Party",
        fontsize.title=120,

        fontcolor.labels=c("#000000","#FFFFFF"),
        fontsize.labels=c(0,10),
        inflate.labels=T,
        fontface.labels="plain",
        bg.labels="#FFFFFF",
        lowerbound.cex.labels=1,
        align.labels=c("center","center"))
```

The above code produces the below plot. The plot is organised first by political party with party colours working to highlight which MP belongs to which party. The names of the 50 most-viewed MPs are written on their boxes.

<figure>
  <img src="/assets/images/tree.jpeg" alt="Treeplot of MP pageviews" class="blog-image">
</figure>

The resulting plot is a good mix of interesting and unsurprising. On a basic level, it makes sense that Boris Johnson as the Prime Minister would be the most viewed MP. Another obvious trend is that almost all of the most-viewed MPs are in the Conservative and Labour parties (or were following the 2019 general election, in cases such as Jeremy Corbyn). Most are pretty regularly in the news for various reasons, are typically party leaders, (shadow) ministers, or former holders of those positions. The SNP and Lib Dem party leaders along with the speaker also appear (the first is hard to make out given the bright yellow of the SNP and the white text). All in all, the results make a good amount of sense.

If you'd like to modify the code or poke around the data yourself, you can access the full R scripts and rds data files for this project [at this link](https://github.com/philswatton/mp_pageviews_2022). I've also included a TSCS dataset of pageviews in 2022, in the event that it might be interesting or useful to someone.

## Foonotes

[^1]: <https://en.wikipedia.org/wiki/Wikipedia>
[^2]: <https://twitter.com/EthanSansom2/status/1517573729244565505>
[^3]: <https://github.com/saschagobel/legislatoR>
[^4]: <https://wikitech.wikimedia.org/wiki/Analytics/AQS/Pageviews>
[^5]: To give a more concrete example, 2022042200 breaks into 2022-04-22-00. This is a year-month-day-hour format. For getting daily page view data, the hours bit is superfluous.
[^6]: <https://r-graph-gallery.com/treemap.html>