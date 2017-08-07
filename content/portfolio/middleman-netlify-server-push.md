+++
date = "2017-08-07T16:44:48+01:00"
image = ""
showonlyimage = false
title = "Middleman Netlify Server Push"

+++

Last month, Netlify introduced their implementation of [HTTP/2 Server Push](https://www.netlify.com/blog/2017/07/18/http/2-server-push-on-netlify/). We started using this and have have noticed significantly faster websites. Here is how to configure Middleman to use this feature.
<!--more-->

Holy technical terms! `middleman netlify server push` what does that even mean? Take it easy—if you're not a developer, you can probably skip the following paragraphs and go straight to _whoa, that IS fast!_.

## TL;DR: Just gimme the code!

<script src="https://gist.github.com/tilsammans/5512def5c88aafc7fb9fbd5309129d02.js"></script>

Now, on to the full story!

### Middleman creates static files

<img src="/img/portfolio/middleman-foundation.jpg">

Middleman is a static website generator, written in Ruby. It is one of the tools we use to deploy websites on Netlify. Middleman is smart enough to use fingerprinted asset URLs. This means that filenames of CSS and JavaScript files change every time we make a change to them. Netlify needs a static file called `_headers` to configure Server Push. To marry the two worlds, we need a bit of code.

We will use the [Middleman Sitemap](https://middlemanapp.com/advanced/sitemap/) to find all the information we need. Then we use a [Middleman Proxy](https://middlemanapp.com/advanced/dynamic-pages/) to generate the file that ends up on the Netlify network. Each time we build, the correct headers are automatically generated.

### Change all the filenames!

Or, how do we automatically use those changed filenames without having to do any work?

<img src="/img/portfolio/lazy-office-worker.png">

When Middlemap has the finished sitemap, it will trigger an event we can use from the config file. Here's the code you'll need in `config.rb`:

```
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
```

When the Sitemap is ready, we fire up a Proxy. If you're as confused by this name as I was, don't worry. This is not a web server proxy; it's a file proxy. It's Middleman's solution for generating a file with dynamic contents. The first argument is the filename you want to have built, and the second is the source template file you'll use to populate it.

About that template file, here is ours. It lives in `source/headers.txt.erb`:

```
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
```

We pass some local variables into this template. Yours will be different from ours. If you want, go nuts with nested hashes, objects or Structs. We chose to keep things flat and simple. Our code in `config.rb` fetches these values from the sitemap. These might change from build to build; but they'll always be exactly the same as Middleman uses internally to generate the output. Which means they will always be up to date, which means we win! Actually, our visitors. But that's good too.

About that, we found it best to use asset fingerprinting, instead of the old cache buster method. We have this line in `config.rb`:

```
activate :asset_hash
```

Now `git push` and sit back!

### Whoa, that IS fast!

The fingerprinted paths end up in the headers file, and Netlify does the rest. You can see for yourself on [www.paulderuiter.nl](https://www.paulderuiter.nl/).

<a href="https://www.paulderuiter.nl"><img src="/img/portfolio/paul-de-ruiter-en.png"></a>
