# mnm:cli

Generates a cli file (argument parser: [yargs](https://github.com/bcoe/yargs)) and modifies your package.json `dist` property 

Options:

### cli

Type: String

Default: `'lib/cli.js'`

(optional) The destination file to copy the cli template

### bin

Type: String

Default: `'lib/cli.js'`

(optional) The string to put in the package.json `bin` property

### index 

Type: String

Default: 'lib/index.js'

(optional) The location of the project index file

### name

Type: String

(optional) The name to be used in the generated cli file to refer the index file i.e. the name of the project, if you don't provide this option it will be gathered from the `name` property of an existing package.json file, in any other case defaults to `indexFile`

### 'skip-install'

Type: Boolean

Default: false

(optional) true to skip the installation of yargs

## Usage

### From the command line

A new project might invoke this generator after npm init e.g.

```sh
$ npm init
$ yo mnm:cli
```

Directory structure

```
package.json
lib/cli.js
```

```js
// packag.json
{
  ...
  bin: 'lib/cli.js'
  ...
}
```

A flat structure can be generated with

```sh
$ npm init
$ yo mnm:boilerplate --index=index.js --cli=cli.js 
```

Directory structure

```
package.json
cli.js
```

```sh
// package.json
{
  ...
  bin: 'cli.js'
  ...
}
```

If the cli will be transpiled you can pass the `bin` option to be written in
package.json

```sh
$ npm init
$ yo mnm:boilerplate --bin=dist/cli.js
```

Directory structure

```
package.json
lib/cli.js
```

```js
// package.json
{
  ...
  bin: 'dist/cli.js'
  ...
}
```

## In another generator

```js
this.composeWith('mnm:cli', {
  options: {
    'skip-install': this.options['skip-install']
  }
}, {
  local: require.resolve('generator-mnm/generators/cli')
})
```

