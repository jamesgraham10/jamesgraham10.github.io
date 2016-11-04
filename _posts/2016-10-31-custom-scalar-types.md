---
layout: post
title:  "Creating Custom Scalar Types with GraphQL"
date:   2016-10-31 09:00:00 +0100
tags: ['javascript']
background: 'hi'
category: blog
summary: "How to create custom scalar types with GraphQL"
---

GraphQL already comes with a number of useful scalar types like `GraphQLFloat`, `GraphQLString`, `GraphQLInt`, `GraphQLList` and so on. But if your using GraphQL for mutations, or your api is fetching data from somewhere else which you need to validate against, creating a custom scalar type starts to make sense.

Luckily this process is fairly straightforward. We can define a new custom scalar type using the `GraphQLScalarType` constructor. Consider this example:

```javascript

const moment = require('moment');

const {
  GraphQLScalarType,
  GraphQLError
} = require('graphql');

module.exports = new GraphQLScalarType({
  name: 'MomentDate',

  // What gets returned to the caller after being queried
  serialize: value => moment(value).format("dddd, MMMM Do YYYY"),

  // What is parsed when the value is embedded into the query string
  parseLiteral: value => validateDateString(value),

  // What is parsed when the value is passed as a variable
  parseValue: value => validateDateString(value)

});

function isMoment (iso) { return moment(iso).isValid(); };

function validateDateString(iso) {
  if (isMoment(iso) ) { return iso }
  else {
    throw new GraphQLError(`${iso} is not a valid date`);
  }
}

```

## How It Works

- The `serialize` function gets invoked whenever a query is made for that scalar type. Most of the time, we probably just want to return with no modifications, but we are free to return and give back to the caller whatever we like. Pretty cool.
- The `parseLiteral` function is inovoked when the scalar value is embedded in the query string, and the `parseValue` function is invoked when the scalar value is passed as a variable.
- In the above example, both `parseLiteral` and `parseValue` call a `validateDateString` function which checks to make sure the value passed generates a valid date. If not, we throw a new `GraphQLError` which gets returned to the caller.
- If we are working with mutations, the above makes validation quite easy and presents an opportunity to transform our data before saving it into the database.

## In Action

### Implementing Our Scalar Type

Now that our scalar type is defined, we can then use it like any other:

```javascript

const {
  GraphQLCustomScalarDate
} = require('../customScalars');

// For a mutation
const EditClassInputType = new GraphQLInputObjectType({
  name: 'ClassEditInput',
  fields:
    return {
      classDate: {
        type: new GraphQLNonNull(GraphQLCustomScalarDate)
      }
      // other fields...
    };
  }
});

// For a query type
const ClassType = new GraphQLObjectType({
  name: 'Class',
  fields:
    return {
      classDate: {
        type: GraphQLCustomScalarDate
      }
      // other fields...
    };
  }
});
```

### Testing Our Scalar With Invalid Params

```javascript
let invalidMutation =  {
  query: `mutation($input: ClassEditInput!) {
    EditClass(input: $input) {
      classDate
    }
  }`,
  variables: {
    // classDate is invalid as we have set the year to 201612
    input: { classDate: '201612-10-31T14:38:07.631Z' }
  }
};

$.post('api/graphql', invalidMutation, response => {
  console.log(response.data.errors[0].message);
  // 201612-10-31T14:38:07.631Z is not a valid date
});
```

In this example, our api exposes an EditClass mutation which lets us, you guessed it, edit classes. Unfortunately our caller has decided that the year is 201612. An error is returned.

### Querying Our Scalar

Once we have class data saved that is valid, we can query like so:

```javascript
let queryClass =  {
  query: `query($id: String!) {
    class(id: $id) {
      classDate
    }
  }`,
  variables: {
    input: { id: '1234' }
  }
};

$.post('api/graphql', queryClass, response => {
  console.log(response.data.class);
  // { classDate: Monday, October 31st 2016 }
});
```
Hurrah. As expected the `classDate` field is returned as per the `serialize` function.

## Wrap Up

I hope this post has conveyed the power and usefulness of custom scalar types in GraphQL. Expect more on this subject shortly.
