---
title: "{{ replace .Name "-" " " | title }}"
date: {{ .Date }}
draft: false
index: true
---
This is your lead paragraph and summary.
<!--more-->
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