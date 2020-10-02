---
title: "{{ replace .Name "-" " " | title }}"
date: {{ .Date }}
description: This will become your lead paragraph and summary.
draft: false
index: true
series: # array. specify related “see also” pages by placing them in the same series.
tags: # array

audio: # array of absolute paths
images: # array of absolute paths
  - /{{ .Type }}/{{ .Name }}/image.jpg
videos: # array of absolute paths
---
{{% param description %}}

## Header
More content goes here.

{{< figure src="image.jpg" caption="Caption text" >}}

{{< highlight ruby >}}
@array.each do |element|
  puts element
end
{{< /highlight >}}

## Recent
{{ range first 10 ( where .Site.RegularPages "Type" "in" .Site.Params.mainSections ) }}
* {{ .Title }}
{{ end }}