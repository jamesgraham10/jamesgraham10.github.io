---
layout: post
title:  "Welcome to Jekyll!"
date:   2016-05-03 20:37:04 +0100
categories: jekyll update
---
You’ll find this post in your `_posts` directory. Go ahead and edit it and re-build the site to see your changes. You can rebuild the site in many different ways, but the most common way is to run `jekyll serve`, which launches a web server and auto-regenerates your site when a file is updated.

To add new posts, simply add a file in the `_posts` directory that follows the convention `YYYY-MM-DD-name-of-post.ext` and includes the necessary front matter. Take a look at the source for this post to get an idea about how it works.

Jekyll also offers powerful support for code snippets:

{% highlight javascript linenos %}

(function() {

  "use strict";

  // Modules
  let request = require('request');

  // Guardian API
  let guardianUrl = 'http://content.guardianapis.com/search?',
      apiKey = '&format=json&api-key=42414072-3f79-4bf0-9c17-9137bc278bfd';

  let requestString = guardianUrl.concat(apiKey);



  function fetchTest (callback) {

    request(requestString, function (error, response, body) {
      if (!error && response.statusCode == 200) {
          callback(body );
      }
    });
  }

  module.exports = {
    // Public methods
    test: function () { console.log('Test successful'); },
    fetchTest: fetchTest
  };


})();

{% endhighlight %}

Check out the [Jekyll docs][jekyll-docs] for more info on how to get the most out of Jekyll. File all bugs/feature requests at [Jekyll’s GitHub repo][jekyll-gh]. If you have questions, you can ask them on [Jekyll Talk][jekyll-talk].

[jekyll-docs]: http://jekyllrb.com/docs/home
[jekyll-gh]:   https://github.com/jekyll/jekyll
[jekyll-talk]: https://talk.jekyllrb.com/
