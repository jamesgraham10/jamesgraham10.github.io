---
layout: post
title:  "Lets make rolling text!"
date:   2016-11-04 12:00:00 +0100
overlayColor: "0, 157, 255, 0.25"
tags: ['css']
category: blog
---

## What We'll Be Building

Today were going to be making some super trendy rolling text. The perfect addition to any agency landing page.

![Rolling text preview](/public/images/posts/2016-11-04/preview.gif){:class="image image--gif"}

## Where To Begin

Lets start by creating some markup:

```html

<div class="roller">
  <p>I fancy a &thinsp;</p>
  <ul class="roller__list">
    <li>piece of fruit</li>
    <li>chocolatey biscuit</li>
    <li>cup of tea</li>
    <li>piece of toast</li>
  </ul>
</div>

```

With our markup ready, we need to make the initial layout work. We will want our `p` tag to sit inline with our list. I've added a thin-space entity to our `p` tag to created the whitespace needed between it and the corresponding `li` tag.

```scss

.roller {
  display: flex;
}

```

A simple `flex` declaration in our `.roller` class here leaves us with the correct result. Our `p` tag nows sits inline with our `ul`. Now lets think about our animation.

If our list items are rolling down into a visible state, were going to want to hide the elements that haven't rolled down yet.

```scss

.roller__list {
  overflow: hidden;
}

```

Ok great. Now lets create an animation that will hide stuff.

```scss

@keyframes roll {
  0%   { transform: translateY(-4em); }
  25%  { transform: translateY(-3em); }
  50%  { transform: translateY(-2em); }
  75%  { transform: translateY(-1em); }
  100% { transform: translateY( 0em); }
}

```

Since our `li` tag is `1em` high, we can use the `em` as our measurement on the animation. Since there are four list items, we start our `transform: translateY` at `-4em`'s. In this state, no `li` tags can be seen and at quarterly intervals, an `li` rolls down into a visible state.

Lets apply this animation to our `li`'s and see what happens:

```scss

.roller__list {
  li {
    animation: roll;
    animation-duration: 1600ms;
    animation-iteration-count: infinite;
  }
}

```

<div class="codepen-block">

  <h2>Part 1</h2>

  <div class="codepen-cntr">
    <p data-height="437" data-theme-id="light" data-slug-hash="GNRywG" data-default-tab="html,result" data-user="jamesgraham10" data-embed-version="2" data-pen-title="fancy rolling text-p1" class="codepen">See the Pen <a href="http://codepen.io/jamesgraham10/pen/GNRywG/">fancy rolling text-p1</a> by James Graham (<a href="http://codepen.io/jamesgraham10">@jamesgraham10</a>) on <a href="http://codepen.io">CodePen</a>.</p>
    <script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>
  </div>


</div>

Awesome. We are definately getting somewhere. But right now, while the text moves down at a good pace (400ms) it feels like the animation is over too quickly. It would be nice if our animation rolled down our `li` tag, waited for a bit, and then continued. Time for some maths!

Lets say we want our animation to last 10 seconds. We have four items, and we want each item to take 400ms to roll down. With our keyframe intervals declared as `%` values, we need to find the `%` interval for each item. So `100 / 10000ms (total animation time) * 400ms (list item interval)` gives us `4%`. That leaves `21%` of waiting time for each `li`.

So lets rewrite our animation now:

```scss

@keyframes roll {
  0%   { transform: translateY(-4em); }
  4%   { transform: translateY(-3em); }
  25%  { transform: translateY(-3em); }
  29%  { transform: translateY(-2em); }
  50%  { transform: translateY(-2em); }
  54%  { transform: translateY(-1em); }
  75%  { transform: translateY(-1em); }
  79%  { transform: translateY(0em);  }
  100% { transform: translateY(0em);  }
}

.roller {
  height: 100vh;
  width: 100vw;
  background: #6956FF;
  color: white;
  font-family: 'Helvetica', sans-serif;
  font-weight: 500;
  padding: 1em;
  font-size: 2rem;
  display: flex;
}

```

As you can see, our animation starts, gets to 4%, waits until 25%, continues and so on. I've also added a few styles to our `roller` class to make things a bit more shiny.

<div class="codepen-block">
  <h2>Part 2</h2>
  <div class="codepen-cntr">

  <p data-height="545" data-theme-id="light" data-slug-hash="PboQwV" data-default-tab="css,result" data-user="jamesgraham10" data-embed-version="2" data-pen-title="fancy rolling text-p2" class="codepen">See the Pen <a href="http://codepen.io/jamesgraham10/pen/PboQwV/">fancy rolling text-p2</a> by James Graham (<a href="http://codepen.io/jamesgraham10">@jamesgraham10</a>) on <a href="http://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>

  </div>
</div>

Now that the text is a bit bigger, you'll notice a problem. We can see fragments of characters like `j/y/j/p` that break out of their height. So lets add some vertical padding to our `li`'s to resolve that issue

```scss

.roller {
  p {
    padding: .125em 0;
  }
}

.roller__list {
  li {
    padding: .125em 0;
  }
}

@keyframes roll {
  0%   { transform: translateY(-5em);    }
  4%   { transform: translateY(-3.75em); }
  25%  { transform: translateY(-3.75em); }
  29%  { transform: translateY(-2.5em);  }
  50%  { transform: translateY(-2.5em);  }
  54%  { transform: translateY(-1.25em); }
  75%  { transform: translateY(-1.25em); }
  79%  { transform: translateY(0em);     }
  100% { transform: translateY(0em);     }
}

```

Adding padding to our `li`'s mean the `p` needs some padding too. It also means we need to recalculate our roll animation a little bit, since our `li`'s now take up `1.25 em`'s of space.

Great. Now lets just add a little bit of pazazz to our animation to round things off:

```scss

.roller__list {
  li {
    animation-timing-function: ease-in-out;
  }
}

```
<div class="codepen-block">

  <h2>Final Solution</h2>
  <div class="codepen-cntr">

    <p data-height="545" data-theme-id="light" data-slug-hash="NbWwya" data-default-tab="css,result" data-user="jamesgraham10" data-embed-version="2" data-pen-title="fancy rolling text" class="codepen">See the Pen <a href="http://codepen.io/jamesgraham10/pen/NbWwya/">fancy rolling text</a> by James Graham (<a href="http://codepen.io/jamesgraham10">@jamesgraham10</a>) on <a href="http://codepen.io">CodePen</a>.</p>
    <script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>

  </div>


</div>
