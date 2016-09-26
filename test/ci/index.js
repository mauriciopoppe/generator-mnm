'use strict'

var path = require('path')
var assert = require('yeoman-assert')
var helpers = require('yeoman-test')
var exec = require('child_process').exec
var series = require('async-series')

describe('generator-mnm on CI', function () {
  this.timeout(600000)

  function handleProcess (command, done) {
    exec(command, function (err) {
      if (err) { return done(err) }
      done(null)
    })
  }

  before(function (done) {
    helpers.run(path.join(__dirname, '../../generators/app'))
      .inDir(path.join(__dirname, '.tmp'))
      .withOptions({ skipInstall: false })
      .withPrompts({
        name: 'Mauricio Poppe',
        email: 'mauricio.poppe@gmail.com',
        url: 'http://maurizzzio.com',
        githubUsername: 'maurizzzio',
        moduleName: 'generator-mnm-example',
        moduleDescription: 'An example of the generator https://github.com/maurizzzio/generator-mnm',
        moduleLicense: 'MIT',
        moduleKeywords: ['generator', 'example', 'mnm'],
        // addons
        coverage: true,
        // generator-license/app
        // license: 'MIT',
        // ./generators/readme
        badges: ['npm', 'travis', 'codecov', 'david', 'downloads']
      })
      .on('end', done)
  })

  describe('with default options', function () {
    it('should have the required files in package.json', function () {
      assert.file('package.json')
      assert.JSONFileContent('package.json', {
        name: 'generator-mnm-example',
        version: '0.0.0',
        main: 'dist/generator-mnm-example.js',
        module: 'dist/generator-mnm-example.mjs',
        'jsnext:main': 'dist/generator-mnm-example.mjs',
        license: 'MIT'
      })
    })

    it('should have the required contents in .babelrc', function () {
      assert.file('.babelrc')
      assert.JSONFileContent('.babelrc', {
        presets: ['es2015']
      })
    })

    it('should have the required contents in .travis.yml', function () {
      assert.file('.travis.yml')
      assert.fileContent('.travis.yml', 'npm run build')
      assert.fileContent('.travis.yml', 'npm run coverage')
    })

    it('should execute package.json scripts', function (done) {
      series([
        function (cb) { handleProcess('npm run build', cb) },
        function (cb) { handleProcess('npm test', cb) }
      ], done)
    })

    it('should be compatible with commonjs\' require', function (done) {
      handleProcess('node -e "require(\'./dist/generator-mnm-example.js\')(\'awesome\')"', done)
    })
  })
})

