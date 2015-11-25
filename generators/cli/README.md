# mnm:cli

Creates the file `lib/cli.js` (written in es6), it also adds the field `bin:
dist/cli.js` on your package.json file (argument parser: [minimist](https://github.com/substack/minimist))

```js
this.composeWith('mnm:cli', {
  options: {
    'skip-install': this.options['skip-install']
  }
}, {
  local: require.resolve('generator-mnm/generators/cli')
})
```

