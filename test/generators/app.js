'use strict'

var path = require('path')
var extend = require('extend')
var assert = require('yeoman-assert')
var helpers = require('yeoman-test')
var answers = require('../helpers/answers.json')

describe('node-mnm:app', function () {
  this.timeout(20000)

  require('../helpers/set-up-mockery')(before, after)

  describe('running on new project', function () {
    before(function () {
      return helpers.run(path.join(__dirname, '../../generators/app'))
        .inDir(path.join(__dirname, '.tmp'))
        .withPrompts(extend(answers, {}))
        .toPromise()
    })

    it('creates files', function () {
      assert.file([
        '.travis.yml',
        '.gitignore',
        'README.md',
        'src/index.js',
        'test/index.js'
      ])
    })

    it('creates package.json', function () {
      assert.file('package.json')
      assert.JSONFileContent('package.json', {
        name: answers.moduleName,
        version: '0.0.0',
        description: answers.moduleDescription,
        license: answers.moduleLicense,
        author: {
          name: answers.name,
          email: answers.email,
          url: 'http://' + answers.website
        },
        main: 'dist/' + answers.moduleName + '.js',
        module: 'dist/' + answers.moduleName + '.mjs',
        'jsnext:main': 'dist/' + answers.moduleName + '.mjs',
        keywords: answers.moduleKeywords,
        repository: answers.githubUsername + '/' + answers.moduleName
      })
    })

    it('creates and fill contents in README.md', function () {
      assert.file('README.md')
      assert.fileContent('README.md', 'import generatorMnm from \'generator-mnm\'')
      assert.fileContent('README.md', '> A node module generator')
      assert.fileContent('README.md', 'npm install --save generator-mnm')
      assert.fileContent('README.md', 'MIT')
      assert.fileContent('README.md', '[Mauricio Poppe](http://maurizzzio.com)')
      assert.fileContent('README.md', '[travis-image]: https://img.shields.io/travis/maurizzzio/generator-mnm.svg')
      assert.fileContent('README.md', '[![Codecov Status][codecov-image]][codecov-url]')
    })

    it('creates a valid .npmignore file', function () {
      assert.file('.gitignore')
      assert.fileContent('.gitignore', '.DS_Store')
      assert.fileContent('.gitignore', 'node_modules')
      assert.fileContent('.gitignore', 'dist/')
      assert.fileContent('.gitignore', '.nyc_output')
      assert.fileContent('.gitignore', 'coverage')
    })
  })
})
