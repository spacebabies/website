---
title: A postcode widget in React
date: "2016-11-05T19:56:17+05:30"
description: Our job is to create beautiful, fast and secure web applications. This postcode widget embodies all three aspects.
images:
  - /changelog/building-a-postcode-widget-in-react/blitts-widget.png
---

{{% param description %}}

{{< figure src="blitts-widget.png" caption="Blitts postcode widget" >}}

The widget is in use on [Blitts](http://www.blitts.nl/), one of the products we maintain. Blitts allows you to request a permit for home improvement. Enter your postcode to see if the product is supported in your area. (hint: only Dutch postcodes will work. Try 1234AA 1 for a success response).

## Out with the old

It’s a beautiful case of inline jQuery circa 2009:

{{< highlight html >}}
<form id="postcodecheck">
  <input id="postcode" name="postcode" placeholder="1234AA">
  <input id="housenumber" name="housenumber" placeholder="1">
  <input id="housenumber_addition" name="housenumber_addition" placeholder="a">
  <input type="submit" value="Check!" class="next-button">
  <p class="postcodecheck-result"></p>
</form>

<script>
  $(function() {
    $('#postcodecheck').submit(function (e) {
      e.preventDefault();
      $('.postcodecheck-result').text('');
      var postcode = $(this).find('#postcode').val();
      var housenumber = $(this).find('#housenumber').val();
      var housenumber_addition = $(this).find('#housenumber_addition').val();
      $.ajax({
        type: 'GET',
        url: '/postcodecheck/' + postcode + '/' + housenumber + '/' + housenumber_addition,
        success: function(data) {
          if(data.available){
            $('.postcodecheck-result').text('Address available');
          } else {
            $('.postcodecheck-result').text('Address not available');
          }
        }
      });
    });
  });
</script>
{{< /highlight >}}

To break that down a little, we have a normal HTML form and a chunk of inline jQuery directly after it. It works, but lacks input validation, attaches to $(document).ready, and blocks rendering, amongst many other things we’d all like to avoid.

Let’s get started modernizing it!

## We choose React

Since Blitts is a Rails app, step one is to install react-rails, after which we can start writing our components.

{{< highlight bash >}}
echo "gem 'react-rails'" >> Gemfile
bundle
rails g react:install
{{< /highlight >}}

We’ll replace all of the inline HTML with a react_component, which we’ll also create. For the time being, we move the form into the component, barely changing it:

{{< highlight ruby >}}
<%= react_component('PostcodeCheck') %>
{{< /highlight >}}

{{< highlight javascript >}}
var PostcodeCheck = React.createClass({
  render: function() {
    return (
      <section>
        <form id="postcodecheck">
          <input id="postcode" name="postcode" placeholder="1234AA">
          <input id="housenumber" name="housenumber" placeholder="1">
          <input id="housenumber_addition" name="housenumber_addition" placeholder="a">
          <input type="submit" value="Check!" class="next-button">
          <p class="postcodecheck-result"></p>
        </form>
      </section>
    );
  }
});
{{< /highlight >}}

A quick peek in a browser confirms that the form renders. Let’s add behavior back in.

We’ll need variables to hold the form’s state, and validator functions for each of the form fields. Each field has a specific type of validation. The additions are outlined here:

{{< highlight javascript >}}
var PostcodeCheck = React.createClass({

  // omitting existing code for brevity

  getInitialState: function() {
    return {
      postcode: '',
      housenumber: '',
      housenumberAddition: '',
      result: ''
    };
  },

  validatePostcode: function(e) {
    this.setState({result: '', postcode: e.target.value.
      substr(0, 7).
      toUpperCase()});
  },

  validateHousenumber: function(e) {
    this.setState({result: '', housenumber: e.target.value.
      replace(/\D/g,'')});
  },

  validateHousenumberAddition: function(e) {
    this.setState({result: '', housenumberAddition: e.target.value.
      toUpperCase()});
  },

  render: function() {
    return (
      <section>
        <h2>Postcodecheck</h2>
        <p>Check hier of u al een vergunning kunt aanvragen met BLITTS.</p>
        <form id="postcodecheck" onSubmit={this.handleSubmit}>
          <p>Uw postcode/huisnummer/toevoeging:</p>
          <input id="postcode" placeholder="1234AA" value={this.state.postcode} onChange={this.validatePostcode}/>
          <input id="housenumber" placeholder="1" value={this.state.housenumber} onChange={this.validateHousenumber}/>
          <input id="housenumber_addition" value={this.state.housenumberAddition} onChange={this.validateHousenumberAddition}/>
          <input type="submit" value="Check!" className="next-button"/>
          <p className="postcodecheck-result">{this.state.result}</p>
        </form>
      </section>
    );
  }
});
{{< /highlight >}}

We’re using controlled components here, meaning React.JS will be in charge of the input values, not the browser. We are going to change all input to uppercase and truncate values where it makes sense. We could go wild here, but we’ll leave it at this.

> In earlier attempts, I had abstracted each input into its own component. That way I would have had each validation isolated. Unfortunately I couldn’t figure out how to update the owning component without falling back to the DOM. When I figure out how to decouple the inputs (without resorting to something like flux), I’ll write a new post.

A check in the browser confirms that the validations are working. We’ve already improved the situation! Time to handle the form submission:

{{< highlight javascript >}}
var PostcodeCheck = React.createClass({

  // all existing code again omitted

  handleSubmit: function(e) {
    e.preventDefault();

    if (!this.state.postcode || !this.state.housenumber) {
      this.setState({result: 'Postcode and house number are required'});
      return;
    }

    $.ajax({
      dataType: 'json',
      url: '/postcodecheck/' + this.state.postcode + '/' + this.state.housenumber + '/' + this.state.housenumberAddition,
      success: function(data) {
        if (data.available) {
          this.setState({result: 'Address available'});
        } else {
          this.setState({result: 'Address not available'});
        }
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(status, err.toString());
      }.bind(this)
    });
  }
});
{{< /highlight >}}

We see the ajax code resurface here.

First off when postcode and house number aren’t present, we won’t post the form but show a friendly message on screen. Second major improvement in a couple minutes!

When the field values look okay, we can let the ajax request go through. Instead of updating the DOM directly, we’re going to use the component’s state to let React do the work for us. We also start handling error responses. And that’s it!

There is plenty to be improved on the back end, such as moving towards a REST API that returns 404 when a postcode isn’t supported. It would get rid of the if-statement in our handler, making it easier to understand. However we’re not touching the backend now, so we’ll have to live with this.

After this change, our widget renders asynchronously, its code is organized, and offers a much richer experience than before. Not bad.

A big tip of the hat to [Hannes Fostie](https://github.com/hannesfostie) for introducing me to React.JS and showing me how awesome it is. Thanks Hannes!
