var path = require('path')
var extend = require('extend')
var assert = require('yeoman-generator').assert
var helpers = require('yeoman-generator').test
var answers = require('../helpers/answers.json')

describe('mnm::test', function () {
  this.timeout(10000)

  require('../helpers/set-up-mockery')(before, after)

  describe('test with default options', function () {
    before(function (done) {
      helpers.run(path.join(__dirname, '../../generators/test'))
        .inDir(path.join(__dirname, '.tmp'))
        .on('end', done)
    })

    it('creates test/index.js', function () {
      assert.file('test/index.js')
      assert.fileContent('test/index.js', 'import test from \'ava\'')
    })

    it('modifies package.json scripts field', function () {
      assert.fileContent('package.json', '"test": "ava"')
      assert.fileContent('package.json', '"test:watch": "ava --watch"')
      assert.JSONFileContent('package.json', {
        ava: { require: ['babel-register'] }
      })
    })
  })

  describe('with coverage on', function () {
    before(function (done) {
      helpers.run(path.join(__dirname, '../../generators/test'))
        .inDir(path.join(__dirname, '.tmp'))
        .withOptions({ coverage: true })
        .on('end', done)
    })

    it('modifies package.json scripts field', function () {
      assert.fileContent('package.json', '"coverage": "nyc npm test && nyc report --reporter=text-lcov > coverage.lcov && codecov"')
    })

    it('creates/modifies .travis.yml', function () {
      assert.file('.travis.yml')
      assert.fileContent('.travis.yml', 'before_install: \'npm install codecov.io\'')
      assert.fileContent('.travis.yml', 'after_success: \'npm run coverage\'')
    })
  })
})
