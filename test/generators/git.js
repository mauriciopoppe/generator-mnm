var path = require('path')
var extend = require('extend')
var assert = require('yeoman-assert')
var helpers = require('yeoman-test')

describe('mnm::git', function () {
  this.timeout(10000)

  require('../helpers/set-up-mockery')(before, after)

  describe('git', function () {
    before(function (done) {
      helpers.run(path.join(__dirname, '../../generators/git'))
        .inDir(path.join(__dirname, '.tmp'))
        .on('end', done)
    })

    it('has the required .gitignore file', function () {
      assert.file('.gitignore')
    }) 
  })
})

