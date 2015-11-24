# generator-node-npm [![Build Status][travis-image]][travis-url]

[![NPM][npm-image]][npm-url]

> Create npm modules written in es6 using `npm` as the build tool!

## Install

```sh
$ npm install -g generator-node-npm
```

## Usage

```sh
$ yo node-npm
```

*Note that this template will generate files in the current directory, so be sure to change to a
new directory first if you don't want to overwrite existing files.*

## Directory structure

Generated with `yo node-npm` inside a new project (cli/codeCoverage modes turned on)

```
.
├── .babelrc
├── .gitignore
├── README.md
├── bin (if required)
├── lib
│   └── <main file>.js
├── node (transpiled code)
├── package.json
└── test
    └── index.js
```

## Available Tasks

You can see the list of all available tasks running `npm run` on the generated project

### `npm start`

Watches the changes in on `lib/`, if there's a file change then the test located
in `test/` are run

### `npm test`

Executes the tests located in `test/`, powered by [substack/tape](https://github.com/substack/tape) (you can write your tests in es6)

### `npm run lint`

Lints `index.js, test/, lib/` (powered by [feross/standard](https://github.com/feross/standard))

### `npm run test:cov` (only when the mode codeCoverage is turned on)

Generates a coverage report of the files tested by `test/index.js`, additionally when a
build is triggered on [TravisCI](https://travis-ci.org) the coverage report will be sent to
[Coveralls](https://coveralls.io/)

### Useful npm commands that you should know

- `npm version major|minor|patch` bumps the package version
- `npm run` lists all available tasks

## Why?

This project is heavily inspired by [this article by Keith Cirkel][stop-using-grunt-gulp] where he describes that
the existing build system tools attempt to solve the problems that exist among them "covering up the inadequacies
of the other tools while also surfacing their own".

[James Halliday](https://www.npmjs.com/~substack) who is the creator of many awesome packages like `browserify` and
`tape` also wrote an article where he points out that the command `npm run` is "perfectly adequate for everything
while maintaining a very tiny configuration footprint."

### Articles to read:

- [Why we should stop using grunt][stop]
- [How to use npm as a build tool][how-to]
- [Task automation with run][task-automation]
- [Choose grunt, gulp or npm][choose]

### Inspiration projects

- https://github.com/yeoman/generator-node
- https://github.com/youngmountain/generator-node-gulp
- https://github.com/keithamus/npm-scripts-example 's awesome `package.json` file

### Related projects

- https://github.com/vinniegarcia/es6-module-starter
- https://github.com/sindresorhus/generator-nm

## Development

Run the tests with `npm test`

## FAQ

### The generator fails if there's no internet connection, why?

The generator uses the package [npm-name](https://www.npmjs.com/package/npm-name) to check whether the package name is available on npm, to disable the check define the env variable `OFFLINE`

```sh
OFFLINE=true yo node-npm
```

## License

2015 MIT © Mauricio Poppe

[npm-image]: https://nodei.co/npm/generator-node-npm.png?downloads=true
[npm-url]: https://npmjs.org/package/generator-node-npm
[travis-image]: https://travis-ci.org/maurizzzio/generator-node-npm.svg?branch=master
[travis-url]: https://travis-ci.org/maurizzzio/generator-node-npm
[coveralls-image]: https://coveralls.io/repos/maurizzzio/generator-node-npm/badge.svg
[coveralls-url]: https://coveralls.io/r/maurizzzio/generator-node-npm
[stop-using-grunt-gulp]: http://blog.keithcirkel.co.uk/why-we-should-stop-using-grunt/

[stop]: http://blog.keithcirkel.co.uk/why-we-should-stop-using-grunt/
[how-to]: http://blog.keithcirkel.co.uk/how-to-use-npm-as-a-build-tool/
[task-automation]: http://substack.net/task_automation_with_npm_run
[choose]: http://ponyfoo.com/articles/choose-grunt-gulp-or-npm
