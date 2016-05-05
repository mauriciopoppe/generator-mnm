var path = require('path')
var extend = require('extend')
var assert = require('yeoman-assert')
var helpers = require('yeoman-test')
var answers = require('../helpers/answers.json')

describe('mnm::readme', function () {
  this.timeout(10000)

  require('../helpers/set-up-mockery')(before, after)

  describe('readme', function () {
    before(function () {
      return helpers.run(path.join(__dirname, '../../generators/readme'))
        .inDir(path.join(__dirname, '.tmp'))
        .withPrompts(answers)
        .withOptions({
          name: 'my-name',
          description: 'hello world',
          author: 'maurizzzio',
          website: 'http://maurizzzio.com'
        })
        .toPromise()
    })

    it('creates a readme file', function () {
      assert.file('README.md')
    })

    it('has the required file contents', function () {
      assert.fileContent('README.md', 'myName')
      assert.fileContent('README.md', '> hello world')
      assert.fileContent('README.md', 'import myName from \'my-name\'')
      assert.fileContent('README.md', 'myName()')
      assert.fileContent('README.md', 'MIT')
      assert.fileContent('README.md', '[maurizzzio](http://maurizzzio.com)')
    })
  })
})
