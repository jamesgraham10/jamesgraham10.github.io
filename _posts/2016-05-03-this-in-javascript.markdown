---
layout: post
title:  "This in JavaScript"
date:   2016-05-05 09:00:00 +0100
categories: jekyll update
---

`this` is an object reference which is created by the JavaScript engine whenever a function or method in your code gets invoked. In general `this` will refer to the parent object of the calling function or method. But it can be puzzling at times because there are edge cases where the JavaScript engine does something completely different. As developers, we have to know what these edge cases are, so the key to understanding `this` is to see what it refers to in a range of different contexts.

Take *this* very simple example:

{% highlight javascript %}
  console.log(this); // logs window
{% endhighlight %}

Because our line of code is invoked in the global scope, our call to `console.log` logs the `window` object. Easy enough. So lets see what happens when we start nesting stuff:

{% highlight javascript %}

  function whatIsThis () {
    console.log(this); // logs window
    (function howAboutNow () {
      console.log(this); // logs window
    }();
  }
  whatIsThis();

{% endhighlight %}  

We know that functions create their own scope, so we might think that `this` will now refer to the function that called it. Nope. Our `console.log` calls still log the `window` object because `whatIsThis` is invoked in the context of `window`. Remember, calling `whatIsThis()`, as a global, is the same as calling `window.whatIsThis()`.

<!-- ![My helpful screenshot]({{ site.baseurl }}/assets/images/2.png) -->

Lets see what happens with an object literal:

{% highlight javascript %}
  var Bike = {
    type: 'touring',
    gears: 21,
    mileage: 1254,
    whatAmI: function () {
      console.log(this); // logs our Bike object
    },
    methods: {
      whatAmi: function () {
        console.log(this); // logs our empty methods object
      }
    }
  };
  Bike.whatAmI();
  Bike.methods.whatAmI();
{% endhighlight %}

In our `Bike.whatAmI()` call, because our method in invoked directly from our Bike namespace, `this` gets set to the Bike object. In our `Bike.methods.whatAmI()` call, `this` is set to our `Bike.methods` object. That makes sense. In both cases, `this` refers to the parent object.

When we can grab our main `Bike` object, like we did in our first `Bike.whatAmI()` call, it's super useful as we can have methods that refer to itself like so:

{% highlight javascript %}
  var Bike = {
    type: 'touring',
    gears: 21,
    mileage: 1254,
    sayType: function () {
      console.log('I\'m a ' + this.type + ' bike.');
    }
  };
  Bike.sayType(); // logs 'I'm a touring bike.'
{% endhighlight %}


Now it's time for something more interesting. Lets nest a function in our Bike's first `whatAmI` method:

{% highlight javascript %}
  var Bike = {
    type: 'touring',
    gears: 21,
    mileage: 1254,
    whatAmI: function () {
      console.log(this); // logs our Bike object
      (function () {
        console.log(this); // logs the window object
        }());
    }
  };
  Bike.whatAmI();
{% endhighlight %}

Our self-invoking function inside the `whatAmI` function logs the `window` object. What's going on here? Many people consider this to be a bug in JavaScript. And there isn't really a great explanation for it. So it's very important to remember that any functions nested within methods will set `this` to the `window` object.

But don't worry. There is a nice way around this:

{% highlight javascript %}
  var Bike = {
    type: 'touring',
    gears: 21,
    mileage: 1254,
    whatAmI: function () {
      var that = this;
      (function () {
        console.log(that); // logs the Bike object
        }());
    }
  };
  Bike.whatAmI();
{% endhighlight %}

Nice. Now we can nest functions inside of methods and still get a reference to the object we want to work with. This is really useful when we're using functions inside our methods that need to refer to the main object.

Like this:

{% highlight javascript %}
var Bike = {
      type: 'touring',
      countriesVisited: ['France', 'Germany', 'Turkey', 'Iran', 'India'],
      oldNews: ['France', 'Germany'],
      repeatCountriesVisited: function () {
        var that = this;
        this.countriesVisited.forEach(function (country) {
          if (that.oldNews.indexOf(country) === -1) {
            console.log('I\'ve been to ' + country + '.');
          }
        });
      }
    };
    Bike.sayCountriesVisited();
{% endhighlight %}

Using a combination of `that` and `this` gets a little strange to read, so it's good practise to use `that` (or the equally commonly `self`) in all instances, even when `this` can be used.

{% highlight javascript %}
var Bike = {
      // vars & methods...
      repeatCountriesVisited: function () {
        var that = this;
        that.countriesVisited.forEach(function (country) {
          if (that.oldNews.indexOf(country) === -1) {
            console.log('I\'ve been to ' + country + '.');
          }
        });
      }
    };
    Bike.sayCountriesVisited();
{% endhighlight %}

Everything we have covered so far is applicable when we're using constructor functions and setting methods on the prototype:

{% highlight javascript %}
var Bike = function (type, countriesVisited, oldNews) {
  this.type = type;
  this.countriesVisited = countriesVisited;
  this.oldNews = oldNews;
};

Bike.prototype.repeatCountriesVisited = function () {
  var that = this;
  that.countriesVisited.forEach(function (country) {
    if (that.oldNews.indexOf(country) === -1) {
      console.log('I\'ve been to ' + country + '.');
    }
  });
};

var dawesGalaxy = new Bike(
  'touring',
  ['France', 'Mongolia', 'Pakistan'],
  ['France']
);

dawesGalaxy.repeatCountriesVisited();
// logs:
// I've been to Mongolia.
// I've been to Pakistan.
{% endhighlight %}


Cool! I hope that was useful. The most important to take away is that the JavaScript engine creates `this` when a function or method is called. On methods of an object, `this` will refer to the parent object. If those methods have nested functions, `this` will always refer to the `window` object. Getting the knack of `this` in JavaScript is really a case of seeing what happens to it in different contexts, so I encourage you to play around with the code and try things out for yourself.
