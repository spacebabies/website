---
title: Oh, the favicon. So useless, yet so essential.
date: 2016-09-05T23:42:22+01:00
description: There has to be a reason I keep forgetting the _ultimate_ way to generate a favicon for our sites. Wait, I know! **Favicons are a mess.**
draft: false
index: true
series: # array. specify related “see also” pages by placing them in the same series.
tags: # array

audio: # array of absolute paths
images: # array of absolute paths
  - /changelog/oh--the-favicon-so-useless-yet-so-essential/image.jpg
videos: # array of absolute paths
---
{{% param description %}}


Thankfully there is a [great post by Jonathan T. Neal](http://www.jonathantneal.com/blog/understand-the-favicon/) that explains the big mess and comes up with an awesome solution. However he goes too far I think, in trying to accomodate our old friend Internet Explorer, and ends up with a solution that’s 6 lines in html `<head>`. I want just one.

Here’s the one.

{{< highlight html >}}
<link rel="icon" href="path/to/favicon.png">
{{< /highlight >}}

In addition to the beautiful, retina PNG (that can be anywhere) you stick a good old .ICO in the root path of your website as well. Problem. Solved.

