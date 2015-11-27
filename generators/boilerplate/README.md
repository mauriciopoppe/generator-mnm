# mnm:boilerplate

A simple generator to create an index file and a test file

Options:

### name

Type: String

(optional) The name to be used in `test/index.js` to refer `lib/index.js` i.e. the name of the project, if you don't provide this option it will be gathered from the `name` property of an existing package.json file, in any other case defaults to `indexFile`

### index 

Type: String

Default: `'lib/index.js'`

(optional) The file relative to the current working directory to be index file of your project

### test

Type: String

Default: `'test/index.js'`

(optional) The file relative to the current working directory to be the test file of your project

## Usage

### From the command line

A new project might invoke this generator after npm init e.g.

```sh
$ npm init
$ yo mnm:boilerplate
```

Directory structure

```
package.json
lib/index.js
test/index.js
```

A flat structure can be generated with

```sh
$ npm init
$ yo mnm:boilerplate --index=index.js --test=test.js
```

Project structure

```
pacakge.json
index.js
test.js
```

### From another generator


```js
this.composeWith('mnm:boilerplate', {
  options: {
    index: 'index.js',
    test: 'test.js'
  }
}, {
  local: require.resolve('generator-mnm/generators/boilerplate')
})
```


