var path = require('path')
var extend = require('extend')
var assert = require('yeoman-assert')
var helpers = require('yeoman-test')

describe('mnm::cli', function () {
  this.timeout(10000)

  require('../helpers/set-up-mockery')(before, after)

  describe('cli with default options', function () {
    before(function () {
      return helpers.run(path.join(__dirname, '../../generators/cli'))
        .inDir(path.join(__dirname, '.tmp'))
        .toPromise()
    })

    it('has a cli file', function () {
      assert.file('bin/index.es6.js')
    })

    it('has a valid bin path in package.json', function () {
      assert.JSONFileContent('package.json', {
        bin: 'bin/index.js'
      })
    })

    it('has a script to build the cli', function () {
      assert.fileContent('package.json', 'build:cli')
      assert.fileContent('package.json', 'babel bin/index.es6.js -o bin/index.js')
    })

    it('has the correct file contents', function () {
      assert.fileContent('bin/index.es6.js', '\'../dist/index.js\'')
      assert.fileContent('bin/index.es6.js', '\'yargs\'')
    })
  })
})

