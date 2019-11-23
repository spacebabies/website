+++
title = 'Cookie Opt-In: doing the GOD DAMN CORRECT THING'
date = "2018-05-28T16:30:14+01:00"
images = ["/portfolio/third-party-script-opt-in-using-cookie-consent/img__about-cookie-consent-1-1-1024x588.png"]
+++
Oh, GDPR, GDPGRRRRRRRRRR!
<!--more-->

Have you been in the situation where you—and your
customer!—want to do the right thing, and only load third-party cookies after
an actual opt-in? Fond of the Cookie Consent widget like I am? Read on!

Cookie Consent is decent code to ask your visitors if you may place some
of those dreadful carb-laden things on their computer. I recommend it for
most websites.

Most customers prefer the 'inform only' option where you're out of luck if
you wish to deny cookies. But behold! I have a [customer](http://www.blitts.nl) who wants to do
the right thing! And only load third-party tracking cookies after an explicit
'yes'. [Cookie Consent even has a page dedicated to setting that up.](https://www.osano.com/cookieconsent/documentation/disabling-cookies/)

## YOU FAIL!

The example provided treats _dismiss_ as **allow** and all those third-party
cookies are dumped on all those poor devices! The horror!


*Bad code, from the example*

{{< highlight javascript >}}
var type = this.options.type;
  var didConsent = this.hasConsented();
  if (type == 'opt-in' && didConsent) {
    // enable cookies
  }
{{< /highlight >}}

But to actually only act on _allow_, do this:

{{< highlight javascript >}}
var type = this.options.type
if (type === 'opt-in' && status === 'allow') {
  activateTemplate('#cookieConsent')
}
{{< /highlight >}}

It's a [known issue](https://github.com/insites/cookieconsent/issues/254), although
it's not clear if this will be fixed, or behaving as intended. (??!)

So....how do we pull off delayed third-party loading?

We use [HTML \<templates>](https://www.html5rocks.com/en/tutorials/webcomponents/template/)! Supported by all browsers except legacy IE.

What it does, is put the third-party stuff into an inert block on the page.
With a little scripting magic, you can bring it to life!

Here is the braindead version:

{{< highlight bash >}} html
<template id="cookieConsent">
  <script type="text/javascript">
    (function() {
        var ga = document.createElement('script');
        // ... etc
    })()
  </script>
</template>
{{< /highlight >}}

And how to revive it:

{{< highlight javascript >}}
var content = document.querySelector('#cookieConsent').content
var clone = document.importNode(content, true)
document.body.appendChild(clone)
{{< /highlight >}}

Totally works.

### By the by

If you're copying and pasting the provided snippet from Cookie Consent, you're an idiot.

Pull in those resources so you have everything locally. And add them to your
production bundle so everything comes down the wire with the absolute
minimum amount of overhead.

Example for Rails:

{{< highlight bash >}}
$ curl -O https://cdnjs.cloudflare.com/ajax/libs/cookieconsent2/3.0.3/cookieconsent.min.js
mv cookieconsent.min.js vendor/assets/javascripts
// in application.js:
//= require cookieconsent.min

$ curl -O cdnjs.cloudflare.com/ajax/libs/cookieconsent2/3.0.3/cookieconsent.min.css
mv cookieconsent.min.css vendor/assets/stylesheets
// in application.scss:
@import "cookieconsent.min";
{{< /highlight >}}

And put everything related to this in an IIFE, comme ca:

{{< gist tilsammans c1c9bda68274d5ac473814fdd456766d >}}
