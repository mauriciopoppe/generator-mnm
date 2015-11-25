# mnm:boilerplate

A simple generator to create `lib/index.js` and `test/index.js`, it has no
options since they're read from your package.json file

```js
this.composeWith('mnm:boilerplate', {
  options: { }
}, {
  local: require.resolve('generator-mnm/generators/boilerplate')
})
```

