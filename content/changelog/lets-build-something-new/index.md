+++
title = "Let's Build Something New"
date = "2017-02-05T19:41:01+05:30"
+++
Let's build something totally new today, who'se with me?!
<!--more-->

It has been snowing all weekend, and my town is covered in a fluffy white blanket. Perfect conditions for the creation of a thing.

{{< figure src="pageflow-io.jpg" caption="Pageflow" >}}

We are going to create an add-on to Pageflow. Specifically, we are about to
create a connection between it and [Localfocus](https://www.localfocus.nl/nl/). We want to display pretty
graphs easily! Editors should be able to paste a URL in a field and magic should
happen. MAGIC.

Since Pageflow has been through a big change in code, there aren't many
tutorials teaching the new, correct, way. If you follow this one, step by step, at
the end you'll have a working add-on. Okay, you can skip where I made a mistake. Let's do this!

The code for this exercise is on [GitHub](https://github.com/scrollytelling/pageflow-localfocus).

{{< figure src="woohoo-j-lets-do-this-com-14032494.png" caption="Let's Do This!" >}}

## Reading the docs

The first order of business is [readin' some documentation](https://github.com/codevise/pageflow/blob/99143f6a81ad743a6dd1102db8a6d7918305660b/doc/index.md). With what we are trying to accomplish, the document [Creating a Pageflow Plugin Rails Engine](https://github.com/codevise/pageflow/blob/99143f6a81ad743a6dd1102db8a6d7918305660b/doc/creating_a_pageflow_plugin_rails_engine.md) is the way to go. The bulk of which, incidentally, or maybe not so much, was written by yours truly!

### 1: create a rubygem

Our plugin name is going to be `pageflow-localfocus`. We are modelling it after [`pageflow-chart`](https://github.com/codevise/pageflow-chart) as they do more or less exactly the same thing. Following the instructions, we use Bundler to get started:

{{< highlight bash >}} shell
bundle gem pageflow-localfocus
{{< /highlight >}}

That generated a bunch of files. Wow! Let's commit them all. A brand new git
repository was already created for us, and all the files were added to it too.

{{< highlight bash >}} shell
git commit
{{< /highlight >}}

Time to create [a new repository on GitHub](https://github.com/scrollytelling/pageflow-localfocus), and connect it with our local one.

{{< highlight bash >}} shell
git remote add origin git@github.com:scrollytelling/pageflow-localfocus.git
git push -u origin master
{{< /highlight >}}

Excellent.

{{< figure src="step-1-complete-yrjkpv.jpg" caption="Step 1 Complete" >}}

### 2: fill in the gemspec

The gemspec is a file that describes our gem. As it stands, we need to fix
the TODOs that are in there. Also, we are removing the bit about not pushing
to rubygems, and we add the ddependencies mentioned in the doc.

While we're in here, let's mention the license in the spec and also generate the
actual MIT license in the repository. And while we're still there we'll also
generate a [Contributor Covenant](https://www.contributor-covenant.org). There should
be no mistake that everyone is welcome to help with this project, and abuse
of any kind is not tolerated.

### 3: create the Rails Engine itself

We create a new file that holds the Rails Engine code:

{{< highlight ruby >}}
module Pageflow
  module Localfocus
    class Engine < ::Rails::Engine
      isolate_namespace Pageflow::Localfocus
    end
  end
end
{{< /highlight >}}

In this file we are depending on something something Rails. A-ha. That means we
need add Rails as a dependency in our spec.

_PS: after that initial file, I added two more handy things:_

{{< highlight bash >}}
  # autoload our code, which is Rails dogma
  config.autoload_paths << File.join(config.root, 'lib')

  # automagically reload our React code when it changes
  # This has been fixed in newer versions of react-rails.
  initializer "pageflow-localfocus.add_watchable_files", group: :all do |app|
    app.config.watchable_files.concat Dir["#{config.root}/app/assets/javascripts/**/*.jsx*"]
  end
{{< /highlight >}}

Our first bit of code is in the can! But how can we see if it does something?

Enter the console:

{{< highlight bash >}} shell
bin/console
irb(main):002:0> Pageflow::Localfocus::VERSION
=> "0.1.0"
{{< /highlight >}}

#missionaccomplished

Let's commit the lot and move on. Next!

### 4: Creating a Page Type

We move on to the next piece of documentation: [Creating Page Types](https://github.com/codevise/pageflow/blob/99143f6a81ad743a6dd1102db8a6d7918305660b/doc/creating_page_types.md).

First on the menu is adding the required JavaScript files. We are just following
orders here. If you want to know more, there is a commit for that!

### 5: Registering the Page Component

Look at us! It's not even tea time yet and we're already created a bunch of
new things today. Time to take it to the next level and create a React Component
for our page type. This is also neatly described in the documentation, with
one change I am making: the page component will not be in the main
`components.js` but neatly tucked away in the `components` directory.

I am just copying and pasting stuff at this point with absolutely no idea
as to what it does! Like this:

{{< highlight javascript >}}
(function() {
  const {
    PageWrapper,
    PageBackground, PageBackgroundImage, PageShadow,
    PageContent, PageHeader, PageText
  } = pageflow.react.components;

  function Page(props) {
    return (
      <PageWrapper>
        <PageBackground>
        </PageBackground>

        <PageContent>
        </PageContent>
      </PageWrapper>
    );
  }

  const {registerPageType, connectInPage, combine} = pageflow.react;
  const {pageAttributes} = pageflow.react.selectors;

  registerPageType('localfocus', {
    component: connectInPage(
      combine({
        page: pageAttributes()
      })
    )(Page)
  });
}());
{{< /highlight >}}

It sure looks impressive.

{{< figure src="i-like-the-way-you-move.jpg" caption="I like the way you move" >}}

So far, we've added boilerplate. It's time to get dirty. All we need is
an `<iframe>` that points to the chart. Let's hard-code one into our
component and see if that works.

But wait! What's that? _iframes and React don't go nicely together?_ Of course. Nothing ever works without pain in this ‘ecosystem’. But I am just an old Unix greybeard, don't listen to me. Let's make React happy and jump through some hoops to throw an iframe on the page.

### 6: Adding the actual iframe

It seems like a smart idea to setup a 'ref' to the iframe, as mentioned in the
React documentation. It's the best way to maintain a relation to the DOM object,
which an iframe obviously is. When you need a ref, you cannot use a pure
function to create your component. So, a class it is.

{{< highlight bash >}} jsx
class LocalfocusIframe extends React.Component {
  render() {
    return (
      <iframe
        className="localfocusvisual"
        scrolling="no"
        frameborder="0"
        style="width:100%;height:550px;overflow:hidden"
        ref={iframe => this.iframe = iframe}
        src="https://localfocus2.appspot.com/551a9626918b3?api=1"></iframe>
    );
  }
}
{{< /highlight >}}

We have just put in a random chart URL, because we want to see something now!

The time has come to add our newest baby to our local Pageflow install. But
we need to add still more boiletplate first. Time to work on the editor
integration.

### 7: Setting Up the Editor Integration

As described, we need a Backbone view that will be displayed inside the editor.

I managed to copy and paste the `ConfigurationEditorView` from the doc. But
sadly, more was needed. I needed an input field and a template to render with.
I found inspiration in the [`pageflow-vr`](https://github.com/codevise/pageflow-vr)
plugin which is setup very decent.

I found that I wanted my own URL input field:

{{< highlight bash >}} html
<label>
  <span class="name"></span>
  <span class="inline_help"></span>
  <input
    type="url"
    required pattern="https://localfocus2.appspot.com/.*"
    caption="Only localfocus URLs are allowed"
    placeholder="https://localfocus2.appspot.com/551a9626918b3"
  />
</label>
<div class="validation"></div>
<div class="status_container"></div>
{{< /highlight >}}

Pageflow does provide a built-in URL field, but this doesn't use HTML5 form
field validation. Mine does and also has the `url` type set. Most mobile devices
will tweak the keyboard, making URL entry easier.

We also need a UrlInputView to glue the whole thing together. This one is
pretty large, so I won't paste it here. Take a look at the source.

Then after banging my head against a wall for much longer than I care to admit,
I just went in and chucked all my innovations and copied existing Pageflow
code. Always be shippin'. :'(

### 8: Localization

Finish is in sight! We need to add translation strings for our editor UI.

Once more this is expertly described in the documentation.

### 9: Almost there: the Plugin class

This is pretty routine; copypasta-time once more.

{{< highlight ruby >}}
module Pageflow
  module Localfocus
    class Plugin < Pageflow::Plugin
      def configure(config)
        config.page_types.register(Pageflow::Localfocus.page_type)
      end
    end
  end
end
{{< /highlight >}}

The trick here is to reference our `Localfocus` module when we want to use
this class:

{{< highlight ruby >}}
def self.plugin
  Localfocus::Plugin.new
end
{{< /highlight >}}

Because the autoload pagic has alrady seen `Pageflow` and doesn't look further.
Oh, autoloading, it is so nice, so automagic, I love magic!

## John Dies At The End

_Or, how I started seeing things._

Having created all this awesome code we need just one thing: **RESULTS!**

{{< figure src="10-resultaten.jpg" caption="RESULTS" >}}

It would be a little presumptuous to publish the gem as-is and call it a day.
Instead, we will activate the plugin locally and see what's what. Time to leave
our gem code alone for a bit and go back to Scrollytelling; our Rails app.

Add the under-construction gem to Gemfile:

{{< highlight ruby >}}
gem 'pageflow-localfocus', path: '/Users/joost/Gems/pageflow-localfocus'
{{< /highlight >}}

Install it:

{{< highlight bash >}} shell
bundle install
{{< /highlight >}}

And add it to the Pageflow initializer:

{{< highlight ruby >}}
# ... lots of config
config.plugin(Pageflow::Localfocus.plugin)
# ... lots of config more
{{< /highlight >}}

Progress being made. Yes, we will need more configuration once everything is
done, but for now let's fire up the ol' Rails
server and see if we can select this page type in our editor.

### 💢 NO! Errors are here!

But, oh no! The server won't even start.

{{< highlight ruby >}}
NameError: undefined local variable or method config for Pageflow::Localfocus::Plugin:Class
{{< /highlight >}}

We didn't copy-paste enough code from the documentation. We actually need to
write a method in our plugin class! Duh! That's what you get when you're just
going through the motions.

Our method should look like this:

{{< highlight ruby >}}
def configure(config)
  config.page_types.register(Pageflow::React.create_page_type('localfocus'))
end
{{< /highlight >}}

And now everything starts! Pay attention, y'all!!

We log into the editor, create a new page, and lo and behold, we can select
Localfocus as the page type! (We need to fix the category; we will do that
later.)

### 💢 NO! Errors are here!

But... nothing happens. Or, more specifically, errors are shown in the browser
console:

{{< highlight javascript >}}
Uncaught TypeError: constructor is not a constructor
    at child.createConfigurationEditorView (http://scrollytelling.dev/assets/pageflow/editor/api/page_type.self-34fa332454121a83e2f96da2706f603016182821520121041780d6369b666374.js?body=1:35:12)
{{< /highlight >}}

At this point (actually, a half hour later) I realized I needed to actually
configure the plugin properly. Which means adding it to `components.js` and
the Rails asset stylesheet. Which means doing this in the Rails app:

{{< highlight ruby >}}
# app/assets/javascripts/components.js
//= require "pageflow/localfocus/components"

# app/assets/javascripts/pageflow/application.js
//= require "pageflow/localfocus"

# app/assets/javascripts/pageflow/editor.js
//= require pageflow/localfocus/editor
{{< /highlight >}}

And that worked!

### 💢 NO! Errors are here!

Actually, one:

{{< highlight bash >}}
SyntaxError: unknown: Unexpected token (15:5)
  13 |       );
  14 |     }
> 15 |   }());
     |      ^
  16 |
{{< /highlight >}}

Turns out I hadn't indented the `LocalfocusIframe` class properly. I blame
parentheses. They are always out to get me.

### 💢 NO! Errors are here! IDIOT!

On to the next error, which was that `LocalfocusIframe` is not defined.

Well, it turns out that can't be a pure function either. So I rewrote it
into a proper class:

{{< highlight javascript >}}
class LocalfocusIframe extends React.Component {
  render() {
    return (
      <iframe
        className="localfocusvisual"
        scrolling="no"
        frameborder="0"
        style="width:100%;height:550px;overflow:hidden"
        ref={iframe => this.iframe = iframe}
        src="https://localfocus2.appspot.com/551a9626918b3?api=1">
      </iframe>
    )
  }
}
{{< /highlight >}}

and needed to require it in the page:

{{< highlight javascript >}}
const {LocalfocusIframe} = pageflow.localfocus;
{{< /highlight >}}

Oh, and since we have two JavaScript entry points (one for public view, the
other for the editor), this line needs to be at the very top of either file:

{{< highlight bash >}}
pageflow.localfocus = pageflow.localfocus || {};
{{< /highlight >}}

### 💢 NO! Errors are here!

My editor fields were all messed up.

After trying in vain to wrap my head around Backbone/Marionette, I gave up
and just copied the text input views from Pageflow. `pageflow.inputView` was
my friend. I made no sudden moves, copied every line by precious line, and
then my editor worked. Progress!

### 💢 NO! Errors are STILL here! Amateur!

Still no luck. The LocalFocus frame seemed to load, but was empty. My console
had a big warning about hitting some /null URL over there. Back to you! LOL.
In fact, back to me. I took out the ?api=1 parameter on the iframe source and
that fixed things right back up.

Obviously all my editor UI still shows the UNTRANSLATED STRINGS because I had
to purge the local cache first. Now What?

...

Now, nothing! After that it kind of just worked!

{{< figure src="something-new.png" caption="A LocalFocus graph embedded in a Pageflow/Scrollytelling document" >}}
