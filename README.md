# deep-merge

It's exactly as it sounds.

The first two parameters will be the objects you want to merge, and the optional third parameter is for a conflict handler function.

## Usage

```js
import deepMerge from '@rubicon2/deep-merge';

const objA = {
  a: {
    a: 1
    b: 2,
  }
},

const objB = {
  b: {
    b: 2.5,
    c: 3
  }
}

const result = deepMerge(objA, objB);
// Result:
// {
//   a: {
//     a: 1,
//     b: [2, 2.5],
//     c: 3
//   }
// }
```

## Custom conflict handlers

A 3rd parameter can be passed: ```conflictHandler```. The conflict handler function is called when deepMerge is trying to merge two values to the same key, at least one value isn't an object and both are not undefined. The default handler will merge both values into an array if they are different, or discard one of the values if they are the same.

Here are some ideas for custom conflict handlers.

```js
const keepLast = (a, b) => b;
const keepFirst = (a, b) => a;
// Will put both values into an array regardless of whether a, or b, or both are arrays or plain values.
const keepBoth = (a, b) => [a, b].flat();
const keepLarger = (a, b) => a > b ? a : b;
const keepSmaller = (a, b) => a < b ? a : b;

const merged = deepMerge(objA, objB, keepLast);
```
