/**
 * Created by mauricio on 3/23/15.
 */
'use strict';

var path = require('path')
var assert = require('yeoman-generator').assert
var helpers = require('yeoman-generator').test
var exec = require('child_process').exec
var series = require('async-series')

describe('node-npm on CI', function () {
  this.timeout(600000)

  function handleProcess(command, done) {
    exec(command, function (err) {
      if (err) { return done(err) }
      done()
    })
  }

  before(function (done) {
    helpers.run(path.join(__dirname, '../../generators/app'))
      .inDir(path.join(__dirname, '.tmp'))
      .withOptions({ skipInstall: false })
      .withPrompts({
        name: 'generator-mnm-example',
        description: 'An example of the generator https://github.com/maurizzzio/generator-mnm',
        homepage: 'http://github.com/maurizzzio/generator-mnm-example',
        githubAccount: 'maurizzzio',
        authorName: 'Mauricio Poppe',
        authorEmail: 'mauricio.poppe@gmail.com',
        authorUrl: 'http://maurizzzio.com',
        keywords: ['generator', 'example', 'mnm'],
        
        // addons
        includeCli: true,
        includeCoverage: true,

        // generator-license
        license: 'MIT',

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
        main: 'dist/index.js',
        'jsnext:main': 'src/index.js',
        files: ['/dist', '/src'],
        license: 'MIT'
      })
    })

    it('should have the required contents in .babelrc', function () {
      assert.file('.babelrc')
      assert.JSONFileContent('.babelrc', {
        presets: ['es2015'],
        plugins: ['add-module-exports']
      })
    })

    it('should have the required contents in .travis.yml', function () {
      assert.file('.travis.yml')
      assert.fileContent('.travis.yml', 'npm run build')
      assert.fileContent('.travis.yml', 'npm run coverage')
    })

    it('should have the required contents in LICENSE', function () {
      assert.file('LICENSE')
      assert.fileContent('LICENSE', 'MIT')
    })

    it('should execute package.json scripts', function (done) {
      series([
        function (cb)  { handleProcess('npm run build', cb)  },
        function (cb)  { handleProcess('npm test', cb)  },
      ], done)
    })

    it('should have an executable cli file', function (done) {
      series([
        function (cb) { handleProcess('npm run build:cli', cb) },
        function (cb) { handleProcess('node bin/index.js awesome', cb) }
      ], done)
    })

    it('should be compatible with commonjs\' require', function (done) {
      handleProcess('node -e "require(\'./dist/index.js\')(\'awesome\')"', done)
    })
  })
})
