---
layout: post
title:  "What Is \"This\"?"
images_path: 'javascript_what_is_this'
date:   2016-05-04 09:00:00 +0100
category: blog
tags: ['javascript']
summary: "A closer look at JavaScript\'s \"this\" keyword in different execution contexts"
images:
  menu: 'menu.png'
---

I found the `this` concept really confusing at first. But it isn't so hard really. Just weird. So lets simplify it. Basically `this` is an object reference which is created by the JavaScript engine whenever a function or method in your code gets invoked. In general `this` will refer to the parent object of the calling function or method. But there are edge cases where the JavaScript engine does something completely different. So it's puzzling at times. Lets look at some examples of `this` in action, so we can see what it does in different contexts.

Take *this* very simple example:

```javascript
  console.log(this); // logs window
```

Our line of code is invoked in the global scope. Our call to `console.log` logs the `window` object. That seems to make sense. Lets see what happens when we start nesting stuff:

```javascript

  function whatIsThis () {
    console.log(this); // logs window
    (function howAboutNow () {
      console.log(this); // logs window
    }();
  }
  whatIsThis();
```

We know that functions create their own scope, so we might think that `this` will now refer to the function that called it. Nope. Our `console.log` calls still log the `window` object. Why? Well if we think about it, calling our global `whatIsThis` function is the same as writing `window.whatIsThis`. So `this` is the `window` object because it is the parent to our function.

<!-- ![My helpful screenshot]({{ site.baseurl }}/assets/images/2.png) -->

Lets see what happens with an object literal:

```javascript
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
```

In our `Bike.whatAmI()` call, because our method in invoked directly from our Bike object, `this` gets set to the Bike object. In our `Bike.methods.whatAmI()` call, `this` is set to our otherwise empty `Bike.methods` object. That makes sense. In both cases, `this` refers to the parent object.

That's super useful, as we can have methods which refer to the properties of it's own object like so:

```javascript
  var Bike = {
    type: 'touring',
    gears: 21,
    mileage: 1254,
    sayType: function () {
      console.log('I\'m a ' + this.type + ' bike.');
    }
  };
  Bike.sayType(); // logs 'I'm a touring bike.'
```


Now it's time for something more interesting. Lets nest a function in our Bike's first `whatAmI` method:

```javascript
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
```

What's going on here? We have a function nested in our method which logs the `window` object. That doesn't seem to make much sense. Surely it would log the `Bike` object again? Yup it's weird. Many people consider this feature of JavaScript to be a bug. So you should just remember that any functions nested within methods will set `this` to the `window` object.

But there is a nice work around:

```javascript
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
```

Nice. Now we can nest functions inside of methods and still get a reference to the object we want to work with. This is really useful when we're using functions inside our methods that need to refer to the main object.

Like this:

```javascript
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
    // logs:
    // 'I've been to Turkey.'
    // 'I've been to Iran.'
    // 'I've been to India.'
```

That said, using a combination of `that` and `this` gets a little strange to read, so it's good practise to use `that` (or the equally commonly `self`) in all instances, even when `this` can be used.

```javascript
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
```

Everything we have covered so far is applicable when we're using constructor functions and setting methods on the prototype as well:

```javascript
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
// 'I've been to Mongolia.'
// 'I've been to Pakistan.'
```


Cool! That covers most things. So just try and remember these important things:

- The JavaScript engine creates `this` when a function or method is called.
- On methods of an object, `this` will refer to the parent object.
- If those methods have nested functions, `this` will refer to the `window` object.

Getting the knack of `this` in JavaScript is really a case of seeing what happens to it in different contexts, so I encourage you to play around with the code and try things out for yourself.

[View the Github Gist](https://gist.github.com/jamesgraham10/d6d9d4da7a4826155f503309592e8762){:class="purple"}
