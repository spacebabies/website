---
title: "Remarkable 2 Is Hackable"
date: 2020-11-30T12:54:49+01:00
description: Yaaazz, my [reMarkable 2](https://remarkable.com/) arrived! I discovered it is pretty hackable, too.
draft: false
index: true
series: # array. specify related “see also” pages by placing them in the same series.
  - devices
tags:
  - notebook
  - reMarkable
  - tablet
audio: # array of absolute paths
images: # array of absolute paths
  - /changelog/remarkable-2-is-hackable/a_box.png
  - /changelog/remarkable-2-is-hackable/a_diagram.png
  - /changelog/remarkable-2-is-hackable/remarkable-2-4.jpg
videos: # array of absolute paths
---
{{% param description %}}

## It is a digital Moleskine

And it's really, really good at being it.

{{< multi-figure src="remarkable-2-4" caption="reMarkable 2. I received no compensation for writing this review." >}}

I really love paper notebooks, Moleskines especially so. It's the quickest way for me to make an idea more concrete. Until the reMarkable, there was no device that could make the good old analog notebook obsolete. Alas, its demise has now finally come.

Why?

I do exactly what I could do on paper. No compromise. That means drawing diagrams, making doodles, playing a game of [Kamertje Verhuren]({{< relref "#kamertje-verhuren" >}} "internal link to the bottom of the page ;)"). The pencil should not be worse. Drawings appear instantly. Throwing something away is effortless.

{{< multi-figure src="a_diagram" caption="A diagram. It has a box, arrows, and a cloud." >}}

The reMarkable does it all. And then it has a bunch of features:

* syncs your stuff to internet`
* It converts handwritten words to actual text _(it does this really well)_
* Sharing is built-in
* You can create notes on existing documents, even stuff you scanned
* It has undo!

## Hackable

Turns out it is pretty hackable, too. It has no official support for it, but its brain is just a Linux computer. You can ssh into it as root. Change everything! I was surprised at how many tools are popping up after a search "remarkable hacks".

**Hacking can sometimes be bad. So I prefer the term Tweaking.**

### rmKit

{{< multi-figure src="rmkit" caption="rmKit." >}}

The project that seems to spearhead this movement is rmKit. It's a group of coders, lying a solid framework for easy app development. Their website looks great and bundles the tools: [rmKit.dev](https://rmkit.dev/) 

Also, the [reMarkableWiki](https://remarkablewiki.com/) has lots and lots of information, but it harder to navigate.

### Wacomable

A great tweak, I think, is an app called [reMarkable_mouse](https://github.com/Evidlo/remarkable_mouse) that turns the device into a Wacom tablet. They are little pads that come with a pencil, making drawing on a computer more natural. Illustrators swear by them.

### Custom splash screens

The first thing I did, is customize the various splash screens. I added the four interpid Space Babies to everything! So nice.

{{% gallery %}}
{{% picture src="rebooting" alt="Shown when you chose Reboot in Settings" %}}
{{% picture src="starting" alt="Shown when the device starts cold" %}}
{{% picture src="suspended" alt="Shown when you need to press the power button to begin" %}}
{{% picture src="sleeping" alt="Shown when the device fell asleep" %}}
{{% /gallery %}}

## Developments are hot 🌶

Most tools are not compatible with the reMarkable 2 yet. At this point, it's not even officially for sale. The developers are aware of it, though.

## Kamertje verhuren? {#kamertje-verhuren}

What about that game of _kamertje verhuren_ I mentioned? Fear not! It's a classic paper-and-pencil game that never gets old. The reMarkable is perfect for playing it. See:

{{< multi-figure src="kamertje_verhuren" alt="Kamertje verhuren" caption="An evergreen game, played on a grid of dots" >}}
