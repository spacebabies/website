+++
date = "2017-08-21T22:57:46+01:00"
image = "img/portfolio/css3.svg"
showonlyimage = false
title = "Zap those inline styles"
+++
We‘ve all done it: adding inline styles to HTML pages, because the content is dynamic. Backgrounds for example. Inline styles bother me because they bloat the page, can't be cached and just look ugly. Zap those ugly inline styles! Using Rails helpers and bad-ass cache magic. ✨
<!--more-->

I'm gonna walk you step by step.

We're tryna move away from this ugly fella here:

``` html
<section style="background: no-repeat left/300% url(<%= product.image.url %>);">
```

We want to move those styles into the place where styles belong, i.e. a stylesheet. Problem: product images are dynamic; people upload them using the CMS and they sometimes change. The changes are unrelated to deploys and in any case, the product owners don't want to wait on us to change something in the store. We're not the Apple Store, dammit!

We will need a stylesheet and we will want it to be dynamic. This means we want it to go into a controller to fetch the current product images and render those out into something that looks like CSS. And, if you're wondering, no the idiot Sprockets asset pipeline is not going to help us here, even if we add `.erb` to a stylesheet. (Which is a dumb idea if you ever asked me anyway)

<img src="/img/portfolio/530e685201681a4c402b382055389a6f0fcea5941705e348634c53502ca3813e.jpg">

This is going into our layout:

``` html
<%= stylesheet_link_tag "/products.css", media: 'all' %>
```

The astute observer will observe it starts with a slash. This will side-track Sprockets and the asset pipeline meaning we can get down to biznis. Don't copypasta that line quite yet though; it's not good enough as we'll soon see.

The corresponding controller code will look something like this:

``` ruby
def index
  # actually put that Product.all into a helper and memoize it. mkay
  @products = Product.all
end
```

with this in the view, which you should name `index.css.erb`:

``` html
<% @products.each do |product| %>
.product-<%= product.slug %> {
  background: no-repeat left/300% url(<%= product.image.url %>);
}
<% end %>
```

## Excellent job done let's grab a cola!

No, it's not time for a refreshing beverage just yet. While the code probably works, it will cause quite a load on our server. If you've put the stylesheet link into the application layout, we will be fetching **all** the products **all** the times!

<img src="/img/portfolio/a89022ec566abec5307db616b0aaa20adfecd8101f0936a99ac9cef5603b30a6.jpg">

Maybe your server won't explode if you have a couple thousand products, but this really isn't web scale! To solve this, we will use caching. Optionally powered-up by a caching proxy, which you should have either way, if you ask me. Anyway, on to the magic.

To cache things forever, Rails provides the aptly named `http_cache_forever` method. Let's use that!

``` ruby
def index
  @products = Product.all

  http_cache_forever(public: true) do
    render
  end
end
```

Now your caching proxy is going to pick up that file and hold onto it forever, which turns out to be 100 years. Not forever, but still pretty darn long. Also, browsers will do the same. Combined they should make the load quite bearable indeed. But now we're back to square one; if our friendly product managers update a picture, they will yell at us again, because the pictures won't show up. We don't like people yelling at us. Let's fix it.

``` html
<%= stylesheet_link_tag "/#{Product.all.cache_key}", media: 'all' %>
```

See what we did there? We used the magical `cache_key` method on a collection. It's the best method, it's really great. It will change as soon as any product in the collection changes. It looks something like this: `products/query-8983826560f83fe6d0fbc40908b20355-96-20170616123617020825`. Amazing! Combine it with a slight routing tweak:

``` ruby
get "products/:cache_key", to: "products#index"
```

then render the classes using a helper:

``` ruby
def product_classes(product)
  product.map { |product| "product-#{product.slug}" }.join(' ')
end
```

use the helper in your view:

``` html
<section class="<%= product_classes(product) %>">
```

and *now* you can paste those delicious lines into your own app. I don't have a gist handy, but if you hire me to help build you app I'll throw this one in for free! Yay free stuff!
