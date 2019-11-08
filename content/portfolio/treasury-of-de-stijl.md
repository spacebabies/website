+++
title = "Treasury of De Stijl"
date = "2017-07-30T16:30:14+01:00"
images = ["img/portfolio/de-stijl.png"]
+++

For Scrollytelling, we helped build and now host and support [The Treasury of _De Stijl_](https://www.deschatkamervandestijl.nl). We celebrate the art form's Centennial with unique stories and bleeding-edge technology.
<!--more-->

Scrollytelling was commissioned by ARTtube to produce the “treasury”: a collection of never-heard-before stories surrounding _De Stijl_'s seminal figures **Theo van Doesburg**, **Piet Mondriaan**, **Bart van der Leck** and **Vilmos Huszár**.

![Duik in de Schatkamer van De Stijl][1]

We decided to push the web technology envelope a little bit further than usual. The landing page is built using something called static HTML, which is nothing more than the dumbest way possible to create a website. Make no mistake though. A dumb website is a _fast_ website. In this case, it's _crazy fast_. Some of the things we done did:

**Images optimized to the last byte**—our glorious art director [Hamid Salali](http://www.thisishamid.com) works with SVG images. This is wonderful, because SVGs are vectors, which means they're crisp from handhelds up to the highest of definitions. They're also tiny because a SVG is basically computer code. Hamid gave us images of a few kilobytes (a kilobyte is 7 tweets). In most cases, using fancy algorithms, we were able to compress this down to an eye-popping 381 _bytes_. That would be 2.7 tweet. And this is for a full-page HD presentation slide!

**HTTP/2 Server Push**–Space Babies hosts all sites using HTTP/2, the next-level web protocol. That in itself is rather fancy-pants. HTTP/2 is a lot zippier than it's predecessors, giving any website a free turbo boost. But it also allows smart coders to bundle all the different resources that make up a modern website, and send it all down to the client in one go. This means bye-bye to any sort of loading image, because the site is ready before you can say “WHOA”! Go on, open the Treasury in Chrome. We've clocked 300 ms. Yes, for _everything_.

**World-wide Content Delivery Network**—not a breakthrough technology, but you would be surprised how few websites actually use it. We make copies of our website and distribute them across the globe. We put them in all the countries, and all the states, and all the big cities. If you happen to be in a country that's _not_ The Netherlands—I know, the odds are slim, but hear me out—our code won't have to travel from our servers in NL across the ocean floor to you. Everything will already be close by, wherever you are. And in contrast to most mainstream CDN solutions, we make copies of the HTML too. Because static.

In case you wondered, _‘gee Space Babies, did you invent all that stuff yourself?‘_ The answer is a resounding no! We use [Netlify](https://www.netlify.com) to host it for us. Their service is hard to beat, because in addition to all that, everything is encrypted, we can deploy changes in seconds, we do live split-testing, and no, we don't code all the HTMLs, we use a static generator for that. In this case, [Hexo](https://hexo.io). We're quite proud of the whole package and all the separate parts that make it work!

[www.deschatkamervandestijl.nl](https://www.deschatkamervandestijl.nl)

[1]: /img/portfolio/duik-in-de-schatkamer.png
