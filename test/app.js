'use strict'

var path = require('path')
var mockery = require('mockery')
var extend = require('extend')
var assert = require('yeoman-generator').assert
var helpers = require('yeoman-generator').test
var answers = {
  name: 'generator-mnm',
  description: 'A node module generator',
  homepage: 'http://generator-mnm.com',
  githubAccount: 'maurizzzio',
  authorName: 'Mauricio Poppe',
  authorEmail: 'mauricio.poppe@gmail.com',
  authorUrl: 'http://maurizzzio.com',
  keywords: ['foo', 'bar']
}

describe('node-mnm:app', function () {
  this.timeout(10000)

  before(function () {
    mockery.enable({warnOnUnregistered: false})

    mockery.registerMock('npm-name', function (name, cb) {
      cb(null, true)
    })

    mockery.registerMock('github-username', function (name, cb) {
      cb(null, 'unicornUser')
    })

    mockery.registerMock(
      require.resolve('generator-license/app'),
      helpers.createDummyGenerator()
    )
  })

  after(function () {
    mockery.disable()
  })

  describe('running on new project', function () {
    before(function (done) {
      helpers.run(path.join(__dirname, '../generators/app'))
        .inDir(path.join(__dirname, '.tmp'))
        .withPrompts(answers)
        .on('end', done)
    })

    it('creates files', function () {
      assert.file([
        '.travis.yml',
        '.gitignore',
        '.gitattributes',
        'README.md',
        'lib/index.js',
        'test/index.js'
      ])
      assert.noFile('lib/cli.js')
    })

    it('creates package.json', function () {
      assert.file('package.json')
      assert.JSONFileContent('package.json', {
        name: 'generator-mnm',
        version: '0.0.0',
        description: answers.description,
        homepage: answers.homepage,
        author: {
          name: answers.authorName,
          email: answers.authorEmail,
          url: answers.authorUrl
        },
        bugs: {
          url: 'https://github.com/maurizzzio/generator-mnm/issues'
        },
        files: ['dist/'],
        keywords: answers.keywords,
        main: 'dist/index.js'
      })
    })

    it('creates and fill contents in README.md', function () {
      assert.file('README.md')
      assert.fileContent('README.md', 'import generatorMnm from "generator-mnm"')
      assert.fileContent('README.md', '> A node module generator')
      assert.fileContent('README.md', 'npm install --save generator-mnm')
      assert.fileContent('README.md', '[Mauricio Poppe](http://maurizzzio.com)')
      assert.fileContent('README.md', '[travis-image]: https://img.shields.io/travis/maurizzzio/generator-mnm.svg')
      assert.fileContent('README.md', 'coveralls')
    })
  })

  describe('--cli', function () {
    before(function (done) {
      helpers.run(path.join(__dirname, '../generators/app'))
        .inDir(path.join(__dirname, '.tmp'))
        .withOptions({cli: true})
        .withPrompts(answers)
        .on('end', done)
    })

    it('has lib/cli.js', function () {
      assert.file('lib/cli.js')
    })
  })

  describe('--cli set from the prompt', function () {
    before(function (done) {
      helpers.run(path.join(__dirname, '../generators/app'))
        .inDir(path.join(__dirname, '.tmp'))
        .withPrompts(extend({includeCli: true}, answers))
        .on('end', done)
    })

    it('has lib/cli.js', function () {
      assert.file('lib/cli.js')
    })
  })

  // coveralls needs to checked on runtime
})
