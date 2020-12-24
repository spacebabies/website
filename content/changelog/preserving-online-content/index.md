---
title: "Preserving Online"
date: 2020-08-05T13:56:52+02:00
draft: false
images:
    - /changelog/preserving-online-content/photo-1526314114033-349ef6f72220.jpg
description: Online content gets destroyed way too easily. To help preserve, I invented a system that fetches, analyses, and repackages it for eternity. With eternity, I mean about a decade or so. This stuff is surprisingly hard.
---

{{% param description %}}

{{< multi-figure src="photo-1526314114033-349ef6f72220" caption="Stuttgart Stadtbibliothek, photo by Max Langelott" >}}

Case in point are the stories made when our startup [Scrollytelling](https://www.scrollytelling.com) was a thing. All in all, a little under a thousand. What
does it take to preserve them, hopefully for a long time?

## 1. Automation

With these numbers, it makes sense to put the entire process in a script. A
script can be run again and again; in theory the script gets better over time,
and the resulting archive is improved at every turn.

[I have such a script and it's open sourced as well.](https://github.com/scrollytelling/export)

## 2. Repackaging

Online content might look like it's coming from one single place, such as
Facebook or Fox. In reality though, online content is distributed between many
separate servers, domains, even continents. We do this to get stuff to you faster.
To preserve this content though, it's better to have it all contained in a
single place.

For instance, every Scrollytelling story is made up of text, images, sounds and
videos. Live stories have this content living on many different servers:

{{< highlight shell >}}
live
story: https://stories.scrollytelling.com/story-example
layout: https://scrollytelling.link
images: https://media.scrollytelling.com
video: https://output.scrollytelling.com

archived
story: https://archive.scrollytelling.com/story-example
layout: https://archive.scrollytelling.com/scrollytelling.link
images: https://archive.scrollytelling.com/media.scrollytelling.com
video: https://archive.scrollytelling.com/output.scrollytelling.com
{{</highlight >}}

In other words: every single thing the story has, it can be found in a folder
contained within the story folder itself.

### Original media

Since we still have access to the original media, we download those and put
them in a folder. These will be images, sounds and video uploded by the editors
in the original formats. These originals are not used by the story directly,
but having them is crucial if you'd need to have media in new formats at some
point in the future.

## 3. Metadata

Arguably the thing that took up the most time. To have a really rich archive that
is also futureproof, these are part of the archives too:

### Screenshots

I have created a robot that visits the content, makes a screenshot, and repeats
that for every single page it can find. So even if browsers in the future become
so different from today that they cannot show plain HTML, I have simple images
that show exactly how it was supposed to look. Sort of like fossilized bugs
trapped in a piece of ember.

I added EXIF metadata to each screenshot as well, tying them into the archive
and giving additional context such as how and why the screenshot was made. Even
if 98% of people will never see it, the few who do will be delighted:

{{< highlight yaml >}}
-Author: Joost Baaij
-CopyrightNotice: "CC-BY-4.0"
-CreateDate: "#{Time.now.to_s[0,19]}"
-DateTimeOriginal: "#{story.published_at}"
-DocumentName: "#{story.title}"
-description: "#{description}"
-ImageDescription: "#{description}"
-URL: "#{story.url}"
-Caption: "#{story.caption}"
-Keywords: "#{story.keywords.presence || 'story multimedia screenshot' }"
-Language: "#{story.language}"
-OwnerName: Scrollytelling
-rights: "CC-BY-4.0"
-Title: "#{story.title}"
-XMP-cc:AttributionName: Scrollytelling
-XMP-cc:AttributionURL: https://www.scrollytelling.com
-XMP:CreateDate: "#{Time.now.to_s}"
-XMP-cc:license: http://creativecommons.org/licenses/by-cc/4.0/
-XMP-dc:Rights: "#{rights}"
{{</highlight >}}

### Credits

Did you know there is an [unofficial place to put online credits](http://humanstxt.org/)?

It's called **humans.txt** and each Scrollytelling archive has one. It's customized
to those stories speficially, so you'd read about the actual people involved.
For instance, here is ours:

{{< highlight text >}}
Look! It's a
_________________________________________________/\/\____/\/\_______________
___/\/\/\/\____/\/\/\/\__/\/\__/\/\____/\/\/\____/\/\____/\/\____/\/\__/\/\_
_/\/\/\/\____/\/\________/\/\/\/\____/\/\__/\/\__/\/\____/\/\____/\/\__/\/\_
_______/\/\__/\/\________/\/\________/\/\__/\/\__/\/\____/\/\______/\/\/\/\_
_/\/\/\/\______/\/\/\/\__/\/\__________/\/\/\____/\/\/\__/\/\/\________/\/\_
_________________________________________________________________/\/\/\/\___


Scrollytelling was a widely used multimedia storytelling product. What you
have in this folder, is all the stories Scrollytelling produced while they
were with us. Since now, we are no more, it is only fair to give this freely
and make sure the content lives on. Potentially ... forever?

I never realised we were a great Gift to Mankind. But it's undeniable.

==============
Scrollytelling
--------------

💥 It's us! Founders:

- Martijn van Tol
- Joost Baaij

Depending on how far into the future you are, you might try to reach us via
these means: joost@spacebabies.nl martijnvantol@gmail.com. If you have a
neural interface, proceed as usual.

💥 Scrolly's little helpers:

- Our sinus-wave logo was designed by Inge Beekmans. ♥
- Some of our custom work was freelance designed by Hamid Salali. *boks*
- An equal amount of respect for our house photographer Dirk-Jan Visser. 📸
- Many piles of respect for Vincent Kranendonk, developer and universal man. 👨‍🎓

==============
Scrollytelling, a.k.a. our dear customer
--------------

💥 Account managers:

- Tess Janse
- aart jan van der linden
- Reinder Smit
- Billy Nash
- Nienke van Rijn
- Miss Janet Deibert
- dirk jan visser
{{</highlight >}}

### Feeds
For archives to be useful many years from now, it helps if you can consume them
using computer programs. Facilitating this are two technical feed formats anyone
can use to further understand and remix the archive.

First I have introduced a **Atom/RSS** feed. This works similar to the index HTML
file, but usable in so-called News Readers. Programmers often use it, too.

For bona fide access using computer code, I have also introduced a **JSON** feed.
The JSON has all the content the story has, but usable for a computer instead of
a human. Go forth and do unforeseen things with it!

### Microsite

{{< multi-figure src="archive-screenshot-index" >}}

I wrap the archive using a nice little HTML website that contains a link to each
story. It even has search and filter fields to easily work with large archives.

### Timestamps

Lastly, during archival I go back to all story files and backdate the timestamps
on them. Not only is it more accurate, it also helps online caches and
accelerators, because the timestamp never changes and can be used to see if you
have the content already.

## 4. Open it up

Secrecy is the enemy of publicity. I chose to apply a liberal license to the
archives: [Creative Commons Attribution 4.0](https://creativecommons.org/licenses/by/4.0/). This
makes it explicit that anyone can use the archive and build on it, as long as
they give attribution to us.
