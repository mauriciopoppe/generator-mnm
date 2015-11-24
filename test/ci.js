/**
 * Created by mauricio on 3/23/15.
 */
'use strict';

var fs = require('fs-extra');
var path = require('path');
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;
var exec = require('child_process').exec;
var series = require('async-series')
var extend = require('extend');

describe('node-npm on CI', function () {
  this.timeout(600000);

  function handleProcess(command, done) {
    exec(command, function (err) {
      if (err) { return done(err); }
      done()
    });
  }

  before(function (afterInstall) {
    helpers.run(path.join(__dirname, '../app'))
      .inDir(path.join(__dirname, '.tmp'))
      .withOptions({ skipInstall: false })
      .withPrompts({
        name: 'maurizzzio',
        description: 'sandbox description',
        homepage: 'https://github.com/maurizzzio/maurizzzio',
        username: 'maurizzzio',
        authorName: 'Mauricio',
        authorEmail: 'test@example.com',
        keywords: 'sandbox,yo,generator',
        codeCoverage: true,
        cli: true
      })
      .on('end', afterInstall);
  })

  describe('with default options', function () {
    it('should execute package.json scripts', function (done) {
      series([
        function (cb)  { handleProcess('npm test', cb)  },
        function (cb)  { handleProcess('npm run lint', cb)  },
        function (cb)  { handleProcess('npm run babel', cb)  },
        function (cb)  { handleProcess('npm run test:cov', cb)  }
      ], done)
    });

    it('should generate a codecov file', function (done) {
      series([
        function (cb) { handleProcess('npm run test:cov', cb) },
        function (cb) {
          assert.file([ 'coverage/coverage.json' ])
          cb(null)
        }
      ], done)
    })

    it('should be executable', function (done) {
      series([
        function (cb) { handleProcess('node bin/maurizzzio', cb) }
      ], done)
    })
  });
});
