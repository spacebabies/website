+++
images = ["img/portfolio/paul-de-ruiter.jpg"]
date = "2015-08-05T19:59:22+05:30"
title = "Paul de Ruiter"
+++

A stunning new corporate identity, and creation of a new website to go with it.
<!--more-->

[www.paulderuiter.nl/en](https://www.paulderuiter.nl/en/)

<img align="right" class="img-responsive" src="/img/portfolio/paul-de-ruiter-headshot.jpg">Buildings should produce, rather than consume energy. This is the title of Paul de Ruiter's PhD thesis from 1992. Ever since, his practice has been on the forefront of sustainable architecture.

Over the last years, the business has grown considerably. His corporate identity remained the same, including a barely customized Wordpress website. Together with designer Tom Rutgers, we developed a new design for print, outdoor and digital media. It builds on the first one, but reduces and clarifies, giving the work more room to shine. A photography brief focussed on clarity, crisp color and considerable whitespace completes the new look.

## Technology

The website front end in Angular was developed seperately from the back end in Rails. We often met with the front end designer to make sure there would be no surprises come time to deliver. We deployed fierce caching at the <abbr title="Content Delivery Network">CDN</abbr> edge with a special focus on being available in China. Naturally, we have continuous deployment in place. Getting an update through the system can take mere minutes. Including running the tests! It's a thing of beauty.

We built a language switch that keeps the visitor on the current page, wherever they are. It just updates the language on the fly. To guarantee best results on social media, we pre-render the pages for their content spiders. The website itself was created around a custom-built and extremely slim version of Bootstrap, with Middleman generating the html.
