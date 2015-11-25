'use strict';

var fs = require('fs-extra');
var path = require('path');
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;
var os = require('os');
var extend = require('extend');
var prompts = {
  name: 'generator node npm',
  description: 'sandbox description',
  homepage: 'https://github.com/maurizzzio/generator-node-npm',
  username: 'maurizzzio',
  authorName: 'Mauricio',
  authorEmail: 'test@example.com',
  keywords: 'sandbox,yo,generator'
}

function generator () {
  return helpers.run(path.join(__dirname, '../generators/app/'))
    .inDir(path.join(__dirname, '.tmp'))
}

describe('node-npm:app', function () {
  this.timeout(600000)

  describe('with default options', function () {
    // before(function (done) {
    //   // skips the npmName check
    //   generator()
    //     .withOptions({ skipInstall: true })
    //     .withPrompts(prompts)
    //     .on('end', done);
    // });

    // it('creates files', function () {
    //   assert.file([
    //     'src/index.js',
    //     'test/index.js',
    //     'package.json',
    //     '.gitignore',
    //     '.npmignore',
    //     '.travis.yml',
    //     'README.md',
    //   ]);
    // });

    // it('has the required contents (README.md)', function () {
    //   var pkg = fs.readFileSync('README.md', 'utf-8');
    //   assert( !/CLI/.test(pkg) );
    //   assert( !/Coverage\sStatus/.test(pkg) );
    // });
  });

  // describe('with cli', function () {
  //   before(function (done) {
  //     generator()
  //     .withOptions({ skipInstall: true })
  //     .withPrompts(extend({ cli: true }, prompts))
  //     .on('end', done);
  //   });

  //   it('creates files', function () {
  //     assert.file(['bin/generatorNodeNpm']);
  //   });

  //   it('has the required contents (README.md)', function () {
  //     var pkg = fs.readFileSync('README.md', 'utf-8');
  //     assert( /CLI/.test(pkg) );
  //   });

  //   it('has the required contents (package.json)', function () {
  //     var pkg = fs.readFileSync('package.json', 'utf-8');
  //     pkg = JSON.parse(pkg);
  //     assert(pkg.hasOwnProperty('bin'));
  //   });
  // });

  // describe('with code coverage', function () {
  //   before(function (done) {
  //     generator()
  //     .withOptions({ skipInstall: true })
  //     .withPrompts(extend({ codeCoverage: true }, prompts))
  //     .on('end', done);
  //   });

  //   it('has the required contents (README.md)', function () {
  //     var pkg = fs.readFileSync('README.md', 'utf-8');
  //     assert( !/CLI/.test(pkg) );
  //     assert( /Coverage\sStatus/.test(pkg) );
  //   });

  //   it('has the required contents (.travis.yml)', function () {
  //     var pkg = fs.readFileSync('.travis.yml', 'utf-8');
  //     assert( !/npm\stest/.test(pkg) );
  //     assert( /npm install coveralls/.test(pkg) );
  //   });
  // });
});
