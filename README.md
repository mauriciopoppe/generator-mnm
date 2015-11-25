# generator-node-mwm
    
[![NPM][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![Downloads][download-badge]][npm-url]

> Create node modules with es6, tape and npm scripts

## Install

```sh
$ npm install -g generator-mnm
```

## Usage

```sh
$ yo node-mnm
```

<img align="center" src="https://cloud.githubusercontent.com/assets/1616682/11389890/2d80b6a6-931b-11e5-910c-f2594f485098.gif">

## Features

- Made out of many other generators, the main generator only creates a `package.json` file
- Composable, since the logic to create the README, cli and other files is in its own subgenerator you just have to plug as many subgenerators as you need
- es6 + babel out of the box
- [feross/standard](http://standardjs.com/) is the perfect linter for me
- npm scripts are adequate for everything I need

## Most important tasks

| task       | description  |
| -----      | ---          |
| `npm test` | Executes the tests in `test/index.js` (in es6), output piped to [tap-spec](https://github.com/scottcorgan/tap-spec) |
| `npm run lint` | Lints the code with [standard](http://standardjs.com) |
| `npm run build` | Transforms the es6 code located at `lib/` to `dist/` |

You can execute them all at once with `npm run preversion`

See the [list of scripts
included](https://github.com/maurizzzio/generator-mnm/blob/master/generators/app/index.js#L256-L278)

### Useful npm commands that you should know

- `npm version major|minor|patch` bumps the package version
- `npm run` lists all available scripts

## Why?

This project is heavily inspired by [this article by Keith Cirkel][stop-using-grunt-gulp] where he describes that the existing build system tools attempt to solve the problems that exist among them "covering up the inadequacies of the other tools while also surfacing their own".

[James Halliday](https://www.npmjs.com/~substack) who is the creator of many awesome packages like `browserify` and `tape` also wrote an article where he points out that the command `npm run` is "perfectly adequate for everything while maintaining a very tiny configuration footprint."

### Articles to read:

- [Why we should stop using grunt][stop]
- [How to use npm as a build tool][how-to]
- [Task automation with run][task-automation]
- [Choose grunt, gulp or npm][choose]

### Inspiration projects

- https://github.com/yeoman/generator-node
- https://github.com/vinniegarcia/es6-module-starter
- https://github.com/sindresorhus/generator-nm
- https://github.com/bucaran/generator-rise
- https://github.com/keithamus/npm-scripts-example 's awesome `package.json` file

## Development

WIP

### Composability

Just plug in any of the subgenerators or the generator itself on your generator

![yo dawg](https://camo.githubusercontent.com/f8dc3e07d956f1f8dbdea5f895800fe53772a50d/687474703a2f2f692e696d6775722e636f6d2f326771696966742e6a7067)

```js
this.composeWith('mnm:boilerplate', {
  options: {}
}, {
  local: require.resolve('generator-mnm/generators/boilerplate')
})
```

## License

2015 MIT © [Mauricio Poppe](http://maurizzzio.com)

[npm-image]: https://img.shields.io/npm/v/generator-mnm.svg?style=flat-square
[npm-url]: https://npmjs.org/package/generator-mnm
[travis-image]: https://img.shields.io/travis/maurizzzio/generator-mnm.svg?style=flat-square
[travis-url]: https://travis-ci.org/maurizzzio/generator-mnm
[download-badge]: http://img.shields.io/npm/dm/generator-mnm.svg?style=flat-square
[stop-using-grunt-gulp]: http://blog.keithcirkel.co.uk/why-we-should-stop-using-grunt/

[stop]: http://blog.keithcirkel.co.uk/why-we-should-stop-using-grunt/
[how-to]: http://blog.keithcirkel.co.uk/how-to-use-npm-as-a-build-tool/
[task-automation]: http://substack.net/task_automation_with_npm_run
[choose]: http://ponyfoo.com/articles/choose-grunt-gulp-or-npm
