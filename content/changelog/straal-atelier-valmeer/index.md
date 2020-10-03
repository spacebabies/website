---
title: "Straal Atelier Valmeer"
date: 2020-10-02T16:03:10+02:00
draft: false
index: true
description: "Today saw the launch of a new Space Baby: [Straal Atelier Valmeer](https://www.straalatelier.com). An online brochure and sales tool for a sandblasting company. I used the Jamstack for it."
---

{{% param description %}}

Find it at [www.straalatelier.com](https://www.straalatelier.com)

## Jamstack

It's a great example of a [Jamstack](https://www.jamstack.org) website. But what is Jamstack? It consists of the most ubiquitous languages on the web: HTML, CSS, and JavaScript. That helps ensure that the website will work everywhere. There are no special requirements to host it. Jamstack focuses on speed, security, and rapid deployments.

_text continues after image_

{{< figure src="jamstack.webp" caption="Jamstack. I think this is the logo?" >}}

As usual I used [Hugo](https://gohugo.io) to create this website. I decided to put in a little extra effort and create [custom shortcodes](https://gohugo.io/templates/shortcode-templates/) for sections that require it. It's not hard at all! Should have done that way more. I also incorporated stuff I recently learned, and did an extensive round of Search Engine Optimization (SEO).

{{< figure src="much-to-learn-you-still-have.jpg" caption="Meme: Yoda saying 'Much to learn, you still have'" >}}

### 1. Instagram grid

My customer is acrive on Instagram. But I didn't want to use the official toolkit, being overkill and containing trackers. So I copied the nine most recent photos in a grid, similar to the Instagram layout.

{{< figure src="instagrid.png" caption="Instagram photos in a grid" >}}

It was also a perfect chance to use the CSS `grid` specification.

We need a custom shortcode and a small database.

#### layouts/shortcodes/grids/instagram.html

{{< highlight html >}}
<section class="grid">
  {{ range $.Site.Data.grids.instagram }}
  <figure>
    <a rel="nofollow" href="{{ .URL }}">
      <img loading="lazy" src="{{ .image }}" alt="{{ .alt }} ">
    </a>
    <figcaption>{{ .caption | safeHTML }}</figcaption>
  </figure>
  {{ end }}
</section>{{< /highlight >}}

#### data/grids/instagram.yml

{{< highlight yaml >}}
- image: /images/instagram/117308071_317385412740144_5385496135660911575_n.jpg
  alt: Sodastralen
  caption: '<a rel="nofollow" href="https://www.instagram.com/explore/tags/sodastralen/">#sodastralen</a>'
  URL: https://www.instagram.com/p/CD2J6vqn5Pr/
- image: /images/instagram/117440032_2999361750176124_5278278729190427663_n.jpg
  alt: "Voor/na"
  caption: '<a rel="nofollow" href="https://www.instagram.com/explore/tags/voorna/">#voorna</a>'
  URL: https://www.instagram.com/p/CD3McWqHJYG/
{{< /highlight >}}

#### Use in content

{{< highlight markdown >}}
Some text. This is a Markdown template.

{{</* grids/instagram */>}}

More text.
{{< /highlight >}}

I should maybe add the database content to a parameter or something.

### 2. WEBP

There's a new image format in town: [webp](https://developers.google.com/speed/webp). It's better than the old formats, because the files are quite a bit smaller. Smaller is good!

I decided to copy each static website image to webp and use standard HTML to offer both versions to the browser. Modern browsers understands the format and use it. Otherwise the old format is still there as fallback. Also, I took the oppurtinuty to wrap all images in a `figure`, for semantic captions.

In HTML, it looks ilke this:

{{< highlight html >}}
<figure>
  <picture>
    <source type="image/webp" srcset="/path/to/image.webp">
    <source type="image/jpeg" srcset="/path/to/image.jpg">
    <img src="/path/to/image.jpg" alt="Image">
  </picture>

  <figcaption>A great image</figcaption>
</figure>
{{< /highlight >}}

Which as a Hugo custom shortcode looks like this:

#### layouts/shortcodes/figure.html

{{< highlight html >}}
<figure>
    <picture>
        {{ with .Get "webp" }}<source type="image/webp" srcset="{{ . }}">{{ end }}
        {{ with .Get "jpg" }}<source type="image/jpg" srcset="{{ . }}">{{ end }}
        {{ with .Get "png" }}<source type="image/png" srcset="{{ . }}">{{ end }}

        {{ if .Get "jpg" }}<img src="{{ .Get "jpg" }}" alt='{{ .Get "caption" }}'>{{ end }}
        {{ if .Get "png" }}<img src="{{ .Get "png" }}" alt='{{ .Get "caption" }}'>{{ end }}
    </picture>
    
    {{ with .Get "caption" }}<figcaption>{{ . }}</figcaption>{{ end }}
</figure>
{{< /highlight >}}

#### Use in content

{{< highlight markdown >}}
Some text. This is a Markdown template.

{{</* figure webp="/path/to/image.webp" jpg="/path/to/image.jpg" caption="A great image" */>}}

More text.
{{< /highlight >}}

### 3. HTTP headers

I found that these headers give me what I want in a website:

#### static/_headers

{{< highlight text >}}
Cache-Control: public; max-age=60
Referrer-Policy: no-referrer-when-downgrade
Strict-Transport-Security = "max-age=31536000; includeSubdomains; preload"
X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN
{{< /highlight >}}

### 4. Share images and favicon

The HTML for these isn't asthetically pleasing, but every website needs sharing icons. I always rely on the free [favicon generator](https://realfavicongenerator.net/). 

{{< highlight html >}}
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="manifest" href="/site.webmanifest">
<meta name="msapplication-TileColor" content="#b91d47">
<meta name="theme-color" content="#bebcaf">
{{< /highlight >}}

Done.

### Getting it live

My workflow to get it all live hasn't changed much recently. The key to success is using [Netlify](https://www.netlify.com). Every change I make is deployed instantly, even stuff I'm only trying out.

The usual PageSpeed and https best practices are included by default as well:

* bundle CSS and JavaScript
* minify HTML, CSS and JavaScript
* HTTPS only with HSTS headers
* gzip compressed responses
* all the cache headers: `ETag`, `Cache-Control`
* HTTP/2 with preload
* plus some easter eggs

      ██████████████████████████████████████████████
      ███▄─▄█─▄▄─█─▄─▄─█─▄▄─█─▄▄▄─█─▄▄─█▄─▄▄▀█▄─▄▄─█
      █─▄█─██─██─███─███─██─█─███▀█─██─██─▄─▄██─▄▄▄█
      ▀▄▄▄▀▀▀▄▄▄▄▀▀▄▄▄▀▀▄▄▄▄▀▄▄▄▄▄▀▄▄▄▄▀▄▄▀▄▄▀▄▄▄▀▀▀
