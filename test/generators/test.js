var path = require('path')
var assert = require('yeoman-assert')
var helpers = require('yeoman-test')

describe('mnm::test', function () {
  this.timeout(10000)

  require('../helpers/set-up-mockery')(before, after)

  describe('test with default options', function () {
    before(function () {
      return helpers.run(path.join(__dirname, '../../generators/test'))
        .inDir(path.join(__dirname, '.tmp'))
        .toPromise()
    })

    it('creates test/index.js', function () {
      assert.file('test/index.js')
      assert.fileContent('test/index.js', 'import test from \'ava\'')
    })

    it('modifies package.json devDependencies field', function () {
      assert.JSONFileContent('package.json', {
        devDependencies: {
          ava: '*'
        }
      })
    })

    it('modifies package.json scripts field', function () {
      assert.fileContent('package.json', '"test": "ava"')
      assert.fileContent('package.json', '"test:watch": "npm test -- --watch"')
      assert.JSONFileContent('package.json', {
        ava: { require: ['babel-register'] }
      })
    })
  })

  describe('with coverage on', function () {
    before(function () {
      return helpers.run(path.join(__dirname, '../../generators/test'))
        .inDir(path.join(__dirname, '.tmp'))
        .withOptions({ coverage: true })
        .toPromise()
    })

    it('modifies package.json scripts field', function () {
      assert.fileContent('package.json', '"coverage": "nyc npm test && nyc report --reporter=text-lcov > coverage.lcov && codecov"')
    })

    it('creates/modifies .gitignore', function () {
      assert.file('.gitignore')
      assert.fileContent('.gitignore', '.nyc_output')
      assert.fileContent('.gitignore', 'coverage')
    })

    it('creates/modifies .travis.yml', function () {
      assert.file('.travis.yml')
      assert.fileContent('.travis.yml', 'before_install: \'npm install codecov && npm install nyc\'')
      assert.fileContent('.travis.yml', 'after_success: \'npm run coverage\'')
    })
  })
})
