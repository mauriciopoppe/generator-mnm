var path = require('path')
var extend = require('extend')
var assert = require('yeoman-generator').assert
var helpers = require('yeoman-generator').test
var answers = require('../helpers/answers.json')

describe('mnm::boilerplate', function () {
  this.timeout(10000)

  require('../helpers/set-up-mockery')(before, after)

  describe('git', function () {
    before(function (done) {
      helpers.run(path.join(__dirname, '../../generators/boilerplate'))
        .inDir(path.join(__dirname, '.tmp'))
        .withPrompts(answers)
        .on('end', done)
    })

    it('creates the files src/index.js and test/index.js', function () {
      assert.file('test/index.js')
      assert.file('src/index.js')
    })
  })
})
