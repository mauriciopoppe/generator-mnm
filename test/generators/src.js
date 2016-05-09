var path = require('path')
var extend = require('extend')
var assert = require('yeoman-assert')
var helpers = require('yeoman-test')
var answers = require('../helpers/answers.json')

require('../helpers/set-up-mockery')(before, after)

describe('mnm::src', function () {
  this.timeout(10000)

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
      assert.fileContent('package.json', '"build": "babel src/index.js --out-file dist/index.js"')
      assert.fileContent('package.json', '"build:watch": "npm run build -- --watch"')
    })

    it('modifies package.json files field', function () {
      assert.JSONFileContent('package.json', {
        files: ['src/', 'dist/']
      })
    })

    it('modifies package.json devDependencies field', function () {
      assert.JSONFileContent('package.json', {
        // NOTE: this should be updated when mnm dependencies are updated
        devDependencies: {
          'babel-cli': '6.6.5',
          'babel-register': '6.7.2',
          'babel-preset-es2015': '*',
          'babel-plugin-add-module-exports': '*',
          rimraf: '*',
          mkdirp: '*',
          standard: '*'
        }
      })
    })

    it('creates/modifies .gitignore', function () {
      assert.file('.gitignore') 
      assert.fileContent('.gitignore', 'dist/')
    })

    it('creates/modifies .travis.yml', function () {
      assert.file('.travis.yml')
      assert.fileContent('.travis.yml', 'script: \'npm run build\'')
    })
  })

  describe('with options', function () {
    before(function () {
      return helpers.run(path.join(__dirname, '../../generators/src'))
        .inDir(path.join(__dirname, '.tmp'))
        .withOptions({
          src: 'lib/',
          dist: 'build/'
        })
        .toPromise()
    }) 

    it('creates a source file', function () {
      assert.file('lib/index.js')
    })

    it('modifies package.json files field', function () {
      assert.JSONFileContent('package.json', {
        files: ['lib/', 'build/']
      })
    })

    it('creates/modifies .gitignore', function () {
      assert.file('.gitignore') 
      assert.fileContent('.gitignore', 'build/')
    })

    it('modifies package.json scripts field', function () {
      assert.fileContent('package.json', '"build": "babel lib/index.js --out-file build/index.js"')
    })
  })
})
