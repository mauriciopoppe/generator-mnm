'use strict'

var path = require('path')
var extend = require('extend')
var assert = require('yeoman-assert')
var helpers = require('yeoman-test')
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

  require('../helpers/set-up-mockery')(before, after)

  describe('running on new project', function () {
    before(function () {
      return helpers.run(path.join(__dirname, '../../generators/app'))
        .inDir(path.join(__dirname, '.tmp'))
        .withPrompts(answers)
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
        name: 'generator-mnm',
        version: '0.0.0',
        description: answers.description,
        homepage: answers.homepage,
        author: {
          name: answers.authorName,
          email: answers.authorEmail,
          url: answers.authorUrl
        },
        keywords: answers.keywords,
        main: 'dist/index.js',
        files: ['/dist', '/src']
      })
    })

    it('creates and fill contents in README.md', function () {
      assert.file('README.md')
      assert.fileContent('README.md', 'import generatorMnm from \'generator-mnm\'')
      assert.fileContent('README.md', '> A node module generator')
      assert.fileContent('README.md', 'npm install --save generator-mnm')
      assert.fileContent('README.md', '[Mauricio Poppe](http://maurizzzio.com)')
      assert.fileContent('README.md', '[travis-image]: https://img.shields.io/travis/maurizzzio/generator-mnm.svg')
      assert.fileContent('README.md', 'codecov')
    })
  })

  // describe('rollup + babel', function () {
  //   before(function (done) {
  //     helpers.run(path.join(__dirname, '../generators/app'))
  //       .inDir(path.join(__dirname, '.tmp'))
  //       .withPrompts(extend({includeCli: true, includeCodecov: true}, answers))
  //       .on('end', done)
  //   })

  //   it('has a rollup config file', function () {
  //     assert.file('rollup.config.js')
  //     assert.fileContent('rollup.config.js', "entry: 'lib/index.js'")
  //     assert.fileContent('rollup.config.js', "dest: 'dist/generatorMnm.js'")
  //   })
  // })
})
