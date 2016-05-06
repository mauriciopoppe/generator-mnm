var path = require('path')
var extend = require('extend')
var assert = require('yeoman-assert')
var helpers = require('yeoman-test')
var answers = require('../helpers/answers.json')

describe('mnm::src', function () {
  this.timeout(10000)

  require('../helpers/set-up-mockery')(before, after)

  describe('with default options', function () {
    before(function () {
      return helpers.run(path.join(__dirname, '../../generators/src'))
        .inDir(path.join(__dirname, '.tmp'))
        .toPromise()
    })

    it('creates a source file', function () {
      assert.file('src/index.js')
    })

    it('modifies package.json scripts field', function () {
      assert.fileContent('package.json', '"lint": "standard"')
      assert.fileContent('package.json', '"clean": "rimraf dist/ && mkdirp dist/"')
      assert.fileContent('package.json', '"prebuild": "npm run clean -s && npm run lint -s"')
      assert.fileContent('package.json', '"build": "babel src/ --out-file dist/index.js"')
      assert.fileContent('package.json', '"build:watch": "npm run build -- --watch"')
    })

    it('creates/modifies .gitignore', function () {
      assert.file('.gitignore') 
      assert.fileContent('.gitignore', 'node_modules')
    })

    it('creates/modifies .travis.yml', function () {
      assert.file('.travis.yml')
      assert.fileContent('.travis.yml', 'script: \'npm run build\'')
    })
  })

  // describe('with options', function () {
  //   before(function () {
  //     return helpers.run(path.join(__dirname, '../../generators/src'))
  //       .inDir(path.join(__dirname, '.tmp'))
  //       .withOptions({
  //         src: 'lib/',
  //         dist: 'build/'
  //       })
  //       .toPromise()
  //   }) 

  //   it('creates a source file', function () {
  //     assert.file('lib/index.js')
  //   })

  //   it('modifies package.json scripts field', function () {
  //     assert.fileContent('package.json', '"build": "babel lib/ --out-file build/index.js"')
  //   })
  // })
})
