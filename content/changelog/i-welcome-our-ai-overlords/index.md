---
title: "I, for one, welcome our AI overlords"
date: 2021-04-01T12:53:41+02:00
description: Remember WALL-E, the animated garbage compacting robot?
draft: false
index: true
series: # array. specify related “see also” pages by placing them in the same series.
tags:
  - articficial intelligence
  - machine learning
audio: # array of absolute paths
images: # array of absolute paths
  - /changelog/i-welcome-our-ai-overlords/wall-e.jpg
videos: # array of absolute paths
---

{{% param description %}}

{{< multi-figure src="wall-e" caption="WALL-E lives on a dystopian, garbage-ridden planet. That was probably a warning..." >}}

Well, now there is **DALL-E**.

## DALL-E

[DALL-E](https://arxiv.org/abs/2102.12092) is a scientific paper by Aditya Ramesh and others. It describes a new invention how to let computers create images, just by describing them in English. If that sounds fantastical, I agree!

One of the examples given in the [announcement](https://openai.com/blog/dall-e/) is **"an armchair in the shape of an avocado. an armchair imitating an avocado"**. And this, amazingly, is what DALL-E came up with:

{{< grid/5w match="avocado/*" title="an armchair in the shape of an avocado. an armchair imitating an avocado" >}}

## Wha?

To me, this is amazing, fantastical, the-future-is-here and also a little scary. If machines are _this human_, what does that mean for us?

Are we obsolete? (I've never said my ideas were original.)

https://colab.research.google.com/drive/1ID_Y2SyKqsfflxaXB5YQdY33Fytvmja2?usp=sharing

## Results!

What I did, was open the [DALL-E notebook in Google Colab](https://colab.research.google.com/drive/1ID_Y2SyKqsfflxaXB5YQdY33Fytvmja2), follow the instructions, and think of something the computer could create.

### A mouse on a boat in a city

I chose _a mouse on a boat in a city_ and this is the result. Click on any image to enlarge it, and use the arrow keys to see all images in order. This shows really well that DALL-E gets better at creating the picture in every step.

{{< photoswipe match="mouse-on-a-boat/*.png" >}}

## Humans still rule

Unfortunately, the notebook crshed before it could finish. Phew, we still have a use on this planet! But truth be told, I am very impressed. Who knows where this will go?

- [Announcement on openai.com](https://openai.com/blog/dall-e/)
- [Grab the code on GitHub](https://github.com/openai/DALL-E)
- [![Open in Colab](open-in-colab.svg)](https://colab.research.google.com/drive/1ID_Y2SyKqsfflxaXB5YQdY33Fytvmja2)
