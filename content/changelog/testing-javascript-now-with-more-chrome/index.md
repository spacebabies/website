---
title: "Testing JavaScript, now with more Chrome"
date: "2017-10-22T13:34:43+02:00"
images:
  - /changelog/testing-javascript-now-with-more-chrome/google-chrome-sign.jpg
description: Starting today, I am using Chrome to run automated browser tests.
---
{{% param description %}}

I tell Chrome to browse through my sites, click buttons, and (mis)behave like a regular human. And Chrome does so, without complaints, after every little change I make.


**2019 update! Selenium is 2018, [get with the program](https://www.spacebabies.nl/portfolio/testing-applications-with-chrome-devtools-protocol/)!**

A normal part of creating a website is testing it. See if all the buttons work,
see if nothing goes unexpectedly bad, see if everything looks okay. Testing by
hand is soul-crushingly boring though. So there are scripts to help us do that.

For years I have used a mini-browser called PhantomJS. This was okay; it is
based on Webkit (Safari) and things usually work as they should. But not
always. PhantomJS is not a real browser, so it can do a bit less. Also, browsers
change so fast these days, it's impossible to keep up if you're not part of
a big team. So PhantomJS began showing it's age.

Today I made the switch to [Headless Chrome](https://developers.google.com/web/updates/2017/04/headless-chrome). This is the copy of Chrome I have
on my computer, but without a visible screen. The advantage: tests run with
a main stream browser that's in the hands of millions. No more unexplained
timeouts or excuses that tests cannot do some obvious thing.

![Chrome as Pac-Man, eating computer chips][1]

## Here is how I did it, for Cucumber on a Rails project.

1. Remove `poltergeist` from Gemfile
2. Add `selenium-webdriver` and `chromedriver-helper` to it (in group *test*)
3. Run `bundle install`
4. Remove `features/support/poltergeist.rb`
5. Add Headless Chrome configuration in `features/support/chromedriver.rb`:

{{< highlight ruby >}}
require 'chromedriver/helper'

Capybara.register_driver :headless_chrome do |app|
  capabilities = Selenium::WebDriver::Remote::Capabilities.chrome(
    chromeOptions: { args: %w(headless disable-gpu) }
  )

  Capybara::Selenium::Driver.new app,
    browser: :chrome,
    desired_capabilities: capabilities
end

Capybara.javascript_driver = :headless_chrome

{{< /highlight >}}

That's it! Tests were still green, and feel a little faster too.

## You want proof?

Look at the [Pull Request that made this change](https://github.com/scrollytelling/app/pull/21/files).

[1]: /img/portfolio/chrome-pac-man-eating-computer-chips.gif
