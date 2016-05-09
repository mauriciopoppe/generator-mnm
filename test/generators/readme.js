var path = require('path')
var assert = require('yeoman-assert')
var helpers = require('yeoman-test')

require('../helpers/set-up-mockery')(before, after)

describe('mnm::readme', function () {
  this.timeout(10000)
  describe('readme', function () {
    before(function () {
      return helpers.run(path.join(__dirname, '../../generators/readme'))
        .inDir(path.join(__dirname, '.tmp'))
        .toPromise()
    })

    it('creates a readme file', function () {
      assert.file('README.md')
    })
  })
})
