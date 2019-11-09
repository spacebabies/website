+++
title = "Testing all the things with Chrome DevTools Protocol"
date = "2019-05-08T05:49:14+01:00"
+++
If you, like me, are [using Chrome to test your applications](https://www.spacebabies.nl/portfolio/testing-javascript-now-with-more-chrome/), your life just got better.
<!--more-->

It's time to say _adieu_ to Chromedriver and Selenium.

> Quick TLDR: I can control Chrome like a puppeteer and make it go through a project that is still under construction. It can do everything Chrome can, using a script I write. And it happily keeps testing everything, day after day. Hands in the air for outsourcing boring stuff!

<img src="/img/portfolio/la-et-ms-dead-or-alive-s-you-spin-me-round-like-a-record-20161024.jpg" alt="You spin me right round baby right round like a record baby right round round round">

For Ruby on Rails you need a few bits and pieces to make everything work together. Notoriously, a webdriver and Selenium. The former is additional software to be installed on the computer, and the latter is generic browser automation software.

## Dropping Chromedriver

In an attempt to automate some of this pain, various helpers were created. They promised to give us Chromedriver, hassle free! But they delivered us software that was difficult to upgrade, left a mess on your computer and was tied to one single Chrome version. **Did you know Chrome upgrades itself? Now all your tests are broken! Enjoy your life!**

The [Chrome DevTools Protocol](https://chromedevtools.github.io/devtools-protocol/) allows for tools to instrument, inspect, debug and profile Chromium, Chrome and other Blink-based browsers. Many existing projects currently use the protocol. The Chrome DevTools uses this protocol and the team maintains its API.

We can us it to speak to Chrome. Dependency free! Here's how.

<img src="/img/portfolio/joy-choose.jpg" alt="Choose joy">

### Out with the old

``` ruby
gem 'selenium-webdriver'
gem 'chromedriver-helper'
```

Take things like above out, and put in:

``` ruby
gem 'cuprite'
```

Then `bundle install`.

### Buh-hye Selenium

You probably have a file with something like this:

``` ruby
Capybara.register_driver :headless_chrome do |app|
  capabilities = Selenium::WebDriver::Remote::Capabilities.chrome(
    chromeOptions: { args: %w(--headless --no-sandbox --disable-dev-shm-sage --window-size=1600,1200) }
  )

  Capybara::Selenium::Driver.new app,
    browser: :chrome,
    desired_capabilities: capabilities
end
```

Chuck the entire file. Create a new one in the same place:

``` ruby
require 'capybara/cuprite'
Capybara.javascript_driver = :cuprite
```

**All set!**

Yes, I rejected your reality and substituted my own. But it works!

### But I have to work with modals!

We have modal support, son.

``` ruby
page.accept_alert do
  click_on 'Delete'
end
```

### But.... cookies!

Here have the whole jar.

``` ruby
cookies = page.driver.cookies
cookie_name = 'gdpr_consent_misery'

unless cookies[cookie_name]
  page.driver.set_cookie cookie_name, 'dismiss'
  puts "Set cookie `#{cookie_name}`"
end
```

It also works beautifully with `capybara-screenshot`.
