var path = require('path')
var extend = require('extend')
var assert = require('yeoman-assert')
var helpers = require('yeoman-test')

require('../helpers/set-up-mockery')(before, after)

describe('mnm::cli', function () {
  this.timeout(10000)

  describe('cli with default options', function () {
    before(function () {
      return helpers.run(path.join(__dirname, '../../generators/cli'))
        .inDir(path.join(__dirname, '.tmp'))
        .toPromise()
    })

    it('has a cli file', function () {
      assert.file('bin/index.js')
    })

    it('has a valid bin path in package.json', function () {
      assert.file('package.json')
      assert.JSONFileContent('package.json', {
        bin: 'bin/index.es5.js'
      })
    })

    it('has a script to build the cli', function () {
      assert.fileContent('package.json', 'build:cli')
      assert.fileContent('package.json', 'babel bin/index.js -o bin/index.es5.js')
    })

    it('has the correct file contents', function () {
      assert.file('bin/index.js')
      assert.fileContent('bin/index.js', '\'../dist/index.js\'')
      assert.fileContent('bin/index.js', '\'yargs\'')
    })
  })
})

