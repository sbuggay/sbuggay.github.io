---
title: Higher Order Function Composition in JavaScript
date: 2018-01-11
tags:
    - javascript
    - functional
---

<a href="https://en.wikipedia.org/wiki/Function_composition_(computer_science)">Function composition</a> is the act of combining one or many functions into a single function.

For example, lets say our compose function signiture looks like this:

```javascript
function compose(functions) {
    // our code to build the composition
};

// we can use this to craft our composition like so, where a, b, c are functions themselves
const composition = compose([a, b, c]);

// now composition can be used as a function which applies a -> b -> c to generate our output

composition(x);
```

How can we build this function?

```javascript
function compose(functions) {
    // return our inital anonymous function that simply takes in a value
    return function (value) {
        // iterate over our functions, applying them to value in the order given
        for (let i = 0; i < functions.length; i++) {
            // get our output from this function
            let output = functions[i](value);
            // set this to value so the next functions input will be this output
            value = output;
        }

        // return our now transformed value
        return value;
    }
}
```

Let's improve on this further by using [forEach](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach).

```javascript
function compose(functions) {
    // return our inital anonymous function that simply takes in a value
    return function (value) {

        // iterate over our functions, carrying `value` along
        functions.forEach((f) => {
            value = f(value);
        });

        // return our now transformed value
        return value;
    }
}
```

With that simple change we get something much cleaner. We can simplify even futher by using [reduce](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce), where we use the accumulator to store the output of the previous function, with it's inital value being our input.

```javascript
function compose(functions) {
    return (value) => functions.reduce((a, f) => f(a), value);
}
```
