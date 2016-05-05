# mnm:cli

Generates a cli file (argument parser: [yargs](https://github.com/bcoe/yargs)) and modifies your package.json `dist` property 

**NOTE: this assumes that the project has Babel installed**

Options:

### in

Type: String

Default: `'bin/index.es6.js'`

(optional) The destination file to copy the cli template

### out

Type: String

Default: `'bin/index.js'`

(optional) The string to put in the package.json `bin` property

### src

Type: String

Default: `'dist/index.js'`

(optional) The location of the project source file (compiled)

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
bin/index.es6.js
```

```js
// packag.json
{
  ...
  bin: 'bin/index.js',
  scripts: {
    'build:cli': 'babel bin/index.es6.js -o bin/index.js' 
  }
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

