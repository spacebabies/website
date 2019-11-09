+++
title = "ClamAV monitoring with OkComputer"
images = ["/img/portfolio/ok__what_now__by_lazylatiaslover-dbjq69b.png"]
date = "2018-10-10T16:42:32+02:00"
+++
Made the world every so slightly better today.
<!--more-->

![Ok.... what now by lazylatiaslove][1]

For some projects, I add a <mark>virus scanner for every upload going into the system</mark>. You just
don't know what someone could be bringing into your <s>house</s>server, intentionally or not.
In fact, I think you should be checking each and every bit of user-generated content that
comes into your systems. Use an external service and pony up, or do what we done did and deploy your own
virus scanning infrastructure for gratis using [ClamAV](https://www.clamav.net/)!

I am not going into specifics of how file scanning on demand works at scale.
I recommend the combination [clamd/clamdscan](https://linux.die.net/man/1/clamdscan) and the Ruby tool [Clamby](https://github.com/kobaltz/clamby).

![About ClamAV][2]

It's all fun and games to install a little piece of software on a server. But
what needs doing long term, is monitoring if it keeps working.

There are many monitoring tools on the market, but for our Ruby on Rails apps
we like to use OkComputer. There was no known method to monitor ClamAV with
OkComputer. **Until today!**

## We created an OkComputer integration
We wrote the [official check](https://github.com/spacebabies/ok_computer-clamav) which you can add to your installation now.

> Monitor `clamd` from the luxury of your existing OkComputer setup! This check will make noise when the daemon does not respond to messages. It makes a socket connection, sends a PING and waits for a PONG. If any of that does not occur, you'll know it.

It's on [rubygems](https://rubygems.org/gems/ok_computer-clamav) and you can install it using all normal procedures. Enjoy! <3

[1]: /img/portfolio/ok__what_now__by_lazylatiaslover-dbjq69b.png
[2]: /img/portfolio/about-clamav.png
