---
title: "Google PageSpeed: road to 💯"
date: 2021-04-08T13:46:21+02:00
description: Google has this service called PageSpeed. It measures websites and gives them a score, from **0** (probably) to **100**. Getting to 100 can be challenging indeed. I decided to give it my best.
draft: false
index: true
series: # array. specify related “see also” pages by placing them in the same series.
tags: # array
  - web vitals
  - performance
  - google
audio: # array of absolute paths
images: # array of absolute paths
  - https://www.spacebabies.nl/changelog/pagespeed-road-to-100/pagespeed-to-100-lets-go.png
videos: # array of absolute paths
---

{{% param description %}}

## In the beginning...

{{< multi-figure src="pagespeed-beginning-84" caption="84 is pretty far from 100" >}}

This meant I had some work to do. [Full report available](PageSpeed-road-to-100.pdf) (pdf).

I will try to document every step I took here. What actually happened, was I tried a bunch of things to see what could work. Most did, but not all. Those sidetracks have been edited out.

## The initial list

Two things stood out in this first try:

1. [Largest Contentful Paint](https://web.dev/optimize-lcp/) was 4.2 seconds
2. [Time to Interactive](https://web.dev/interactive/) stood at 3.9 seconds

In case you're wondering: that's not great. Some suggestions from PageSpeed were:

- Remove render-blocking sources
- Create images in modern formats
- Remove unused JavaScript
- Remove unused CSS
- Prevent old JavaScript being served to modern browsers

As it turns out, I didn't have to do most things on this list. I had a sneaking suspicion my code was way too bloated, and I knew for sure the images needed some TLC. It turns out, once you fix those things, these items sort of become background noise.

## Optimal images

Images, and video, are pretty big to download. The text of a web page is almost nothing compared to them. So tackled it first.

### Mobile, Tablet, Desktop

{{< multi-figure src="responsive-design-illustrated" caption="A design is responsive when it adapts to the device you're using" >}}

Desktop screens are bigger than mobile ones. So they need more pixels to fill. More pixels means bigger files, and why should mobile visitors suffer from a desktop's burden? They don't. The `<picture>` element was invented for this reason. It's a bunch of work, but I guess that's my job?

I googled `html picture` and went through the list. Most helpful were [Smashing Magazine](https://www.smashingmagazine.com/2014/05/responsive-images-done-right-guide-picture-srcset/) and [CSS Tricks](https://css-tricks.com/a-guide-to-the-responsive-images-syntax-in-html/).

```html
<picture>
  <source
    type="image/webp"
    srcset="
      /img/about/user-picture_450.webp,
      /img/about/user-picture_900.webp 2x
    "
    media="(max-width: 449px)"
  />
  <source
    type="image/webp"
    srcset="
      /img/about/user-picture_900.webp,
      /img/about/user-picture_1200.webp 2x
    "
    media="(min-width: 450px) and (max-width: 1199px)"
  />
  <source
    type="image/webp"
    srcset="/img/about/user-picture_1200.webp"
    media="(min-width: 1200px)"
  />
  <source
    type="image/jpeg"
    srcset="
      /img/about/user-picture_450.jpeg,
      /img/about/user-picture_900.jpeg 2x
    "
    media="(max-width: 449px)"
  />
  <source
    type="image/jpeg"
    srcset="
      /img/about/user-picture_900.jpeg,
      /img/about/user-picture_1200.jpeg 2x
    "
    media="(min-width: 450px) and (max-width: 1199px)"
  />
  <source
    type="image/jpeg"
    srcset="/img/about/user-picture_1200.jpeg"
    media="(min-width: 1200px)"
  />

  <img
    class="img-responsive image-left-overflow"
    src="/img/about/user-picture_450.jpg"
    loading="lazy"
    alt="A stockphoto with a computer screen and human hands."
  />
</picture>
```

### Finally, something for my PC to do

Next up was so-called [image optimization](https://kinsta.com/blog/optimize-images-for-web/). Thankfully, others have done the work for us. I needed to install a bunch of apps on my PC. This step only has to be done once, after that the images are forever optimized.

```bash
# for JPEGs
jpegoptim --all-progressive --strip-all responsive-design-illustrated.jpg

# for PNG
optipng -clobber -strip all all-space-babies.png

# for SVG
svgo assets/all-space-babies.svg

# to make WEBP from any image
cwebp responsive-design-illustrated.jpg -o responsive-design-illustrated.webp
# (webp is the newest format in town. it's both tiny and high quality.)
```

It took a while before I settled on the optimal solution for me: _two_ image formats, and _three_ image sizes. A **format** is JPEG or GIF. A **size** is how many pixels it has. See what's happening here? Three devices, three sizes. Gotcha.

I can tell you it does make a big difference.

### Delete, delete, delete

The fastest image is the one you're not showing. PageSpeed recommended I got rid of unused code that was still being shipped to visitors. It even suggested [software to do it for me](https://purgecss.com/). In the end I did not use that, because I figured I could do more drastic things.

After going through everything, I knew I could get rid of big chunks if I just changed the code a little to work differently. I was able to get rid of jQuery, static icons, oversize fonts, and pretty--but costly--special effects.

That right there shaved half of the stuff!

Not only that, but with jQuery gone everything else sped up as well. Instantly my score went to the high nineties, and PageSpeed didn't nag me about any micro optimization anymore.

{{< multi-figure src="seo-score-92-for-space-babies" caption="I only made this screenshot in a different tool I was using." >}}

### Search Engine Optimization

Speaking of SEO ([download the full report](spacebabies_nl_seocheck_2021_04_05.pdf)), I found it helpful to up my score on that front at the same time. There is some overlap, because you're getting rid of useless ballast. Things I done did:

- [Brought structure to my data](https://developers.google.com/search/docs/guides/intro-structured-data)
- Lazy load images
- Switched to [requestAnimationFrame](https://css-tricks.com/using-requestanimationframe/)
- Added cache statements, helps with reuse
- Added [PostCSS](https://postcss.org/) to the mix
- Got rid of most PNGs, switched to JPG, which are much lighter weight
- Modified JavaScript to run async
- Minified JavaScript and CSS, made sure compression was on too

Every time, my score crept upward. Took a while though.

{{< multi-figure src="mobile-100" caption="Yaaaaaaaassssss" >}}

### Here are some things that helped me push through to 💯

- Defer offscreen images
- Minify CSS
- Minify JavaScript
- Remove Unused JavaScript
- Efficiently encode images
- Enable text compression
- Preconnect to required origins
- Avoid multiple page redirects
- Preload key requests
- Use video formats for animated content
- Remove duplicate modules in JavaScript bundles
- Avoid serving legacy JavaScript to modern browsers
- Preload Largest Contentful Paint image
- Uses efficient cache policy on static assets 0 resources found
- All text remains visible during webfont loads
- Minimize third-party usage
- Lazy load third-party resources with facades
- Avoid large layout shifts
- Uses passive listeners to improve scrolling performance
- Avoids `document.write()`
- Avoid non-composited animations

If you're interested, I've [opened the source code](https://github.com/spacebabies/website) for the website. The framework I've used is [Hugo](https://gohugo.io).

### Stats

Finally, a deep dive into the numbers. Try to beat me!

- Initial server response time is short: 50 ms, yeah
- Avoids enormous network payloads: total size was 342 KiB
- JavaScript execution time: 0.1 s
- Minimizes main-thread work: 0.7 s
