---
title: "Middleman Netlify Server Push"
date: "2017-08-07T16:44:48+01:00"
description: Last month, Netlify introduced their implementation of HTTP/2 Server Push.
---
{{% param description %}}

We started using this and have have noticed significantly faster websites. Here is how to configure Middleman to use this feature.

Holy technical terms! `middleman netlify server push` what does that even mean? Take it easy—if you're not a developer, you can probably skip the following paragraphs and go straight to _whoa, that IS fast!_.

## TL;DR: Just gimme the code!

{{< gist tilsammans 5512def5c88aafc7fb9fbd5309129d02 >}}

Read the [documentation](https://www.netlify.com/blog/2016/04/15/make-your-site-faster-with-netlifys-intelligent-cdn/) too.

Now, on to the full story!

### Middleman creates static files

{{< figure src="middleman-foundation.jpg" alt="Middleman is something that saves time building websites." >}}

Middleman is a static website generator, written in Ruby. It is one of the tools we use to deploy websites on Netlify. Middleman is smart enough to use fingerprinted asset URLs. This means that filenames of CSS and JavaScript files change every time we make a change to them. Netlify needs a static file called `_headers` to configure Server Push. To marry the two worlds, we need a bit of code.

We will use the [Middleman Sitemap](https://middlemanapp.com/advanced/sitemap/) to find all the information we need. Then we use a [Middleman Proxy](https://middlemanapp.com/advanced/dynamic-pages/) to generate the file that ends up on the Netlify network. Each time we build, the correct headers are automatically generated.

### Change all the filenames!

Or, how do we automatically use those changed filenames without having to do any work?

{{< figure src="lazy-office-worker.png" alt="The stereotype is that office workers are lazy." >}}

When Middleman has finished constructing the sitemap, it will trigger an event we can use from the config file. Here's the code you'll need in `config.rb`:

{{< highlight bash >}}
ready do
  # Insert fingerprinted asset paths into _headers for Netlify.
  proxy "/_headers", "/headers.txt",
    layout: false,
    locals: {
      all_css: sitemap.find_resource_by_path('css/all.css'),
      vendor_js: sitemap.find_resource_by_path('js/vendor.js'),
      main_js: sitemap.find_resource_by_path('js/main.js')
    },
    ignore: true
end
{{< /highlight >}}

When the Sitemap is ready, we fire up a Proxy. If you're as confused by this name as I was, don't worry. This is not a web server proxy; it's a file proxy. It's Middleman's solution for generating a file with dynamic contents. The first argument is the filename you want to have built, and the second is the source template file you'll use to populate it (with the rendering engine extension removed).

About that template file, here is ours. It lives in `source/headers.txt.erb`:

{{< highlight bash >}}
# configure HTTP/2 Server Push
/
  Link: <<%= all_css.url %>>; rel=preload; as=style
  Link: <<%= vendor_js.url %>>; rel=preload; as=script
  Link: <<%= main_js.url %>>; rel=preload; as=script

# Set a long cache expiry on asset urls
<%= all_css.url %>
  Cache-Control: public, max-age=31556926
<%= vendor_js.url %>
  Cache-Control: public, max-age=31556926
<%= main_js.url %>
  Cache-Control: public, max-age=31556926
{{< /highlight >}}

The local variables you see being used here were given to the template from our config file. Yours will be different from ours. If you want, go nuts with nested hashes, objects or Structs. We chose to keep things flat and simple.

The values of these variables will change if your asset files have changed. And that's exactly what you want, since those new values are used in your asset helpers as well. We're tapping into the exact mechanism Middleman uses internally. For a double whammy, that means we can also set far-future cache headers on those assets. We handle that in the `_redirect` file in one go. We win the internet! Actually, our visitors win. But that's good too.

About asset URLs, we found it best to use fingerprinting, instead of the old cache buster method. We have this line in `config.rb`:

{{< highlight bash >}}
activate :asset_hash
{{< /highlight >}}

Now `git push` and sit back!

### Whoa, that IS fast!

The fingerprinted paths end up in the headers file, and Netlify does the rest. You can see for yourself on [www.paulderuiter.nl](https://www.paulderuiter.nl/).

<a href="https://www.paulderuiter.nl">{{< figure src="paul-de-ruiter-en.png" alt="Mugshot of Paul de Ruiter" >}}</a>
