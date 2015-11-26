/**
 * Created by mauricio on 3/23/15.
 */
'use strict';

var path = require('path');
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;
var exec = require('child_process').exec;
var series = require('async-series')

describe('node-npm on CI', function () {
  this.timeout(600000)

  function handleProcess(command, done) {
    exec(command, function (err) {
      if (err) { return done(err) }
      done()
    })
  }

  before(function (afterInstall) {
    helpers.run(path.join(__dirname, '../generators/app'))
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
        includeCoveralls: true,

        // generator-license
        license: 'MIT',

        // ./generators/readme
        badges: ['npm', 'travis', 'coveralls', 'david', 'downloads']
      })
      .on('end', afterInstall);
  })

  describe('with default options', function () {
    it('should execute package.json scripts', function (done) {
      series([
        function (cb)  { handleProcess('npm test', cb)  },
        function (cb)  { handleProcess('npm run lint', cb)  },
        function (cb)  { handleProcess('npm run build', cb)  }
      ], done)
    });

    it('should generate a codecov file', function (done) {
      series([
        function (cb) { handleProcess('npm run test:coverage', cb) },
        function (cb) {
          assert.file([ 'coverage/coverage.json' ])
          cb(null)
        }
      ], done)
    })

    it('should be executable', function (done) {
      series([
        function (cb) { handleProcess('node dist/cli.js awesome', cb) }
      ], done)
    })
  });
});
