var path = require('path')
var extend = require('extend')
var assert = require('yeoman-generator').assert
var helpers = require('yeoman-generator').test
var answers = require('../helpers/answers.json')

describe('mnm::git', function () {
  this.timeout(10000)

  require('../helpers/set-up-mockery')(before, after)

  describe('git', function () {
    before(function (done) {
      helpers.run(path.join(__dirname, '../../generators/git'))
        .inDir(path.join(__dirname, '.tmp'))
        .withPrompts(answers)
        .on('end', done)
    })

    it('has the required .gitignore and .gitattributes files', function () {
      assert.file('.gitignore')
      assert.file('.gitattributes')
    }) 

    it('has the correct repository field', function () {
      assert.fileContent('package.json', /maurizzzio\/generator-mnm/)
    })
  })
})

