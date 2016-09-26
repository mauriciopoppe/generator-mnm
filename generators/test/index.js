'use strict'
var path = require('path')
var toCase = require('to-case')
var relative = require('relative')

var Base = require('../base')

module.exports = Base.extend({
  constructor: function () {
    Base.apply(this, arguments)

    this.option('src', {
      type: String,
      required: false,
      defaults: 'src/',
      desc: 'Source code folder (relative to the project root)'
    })

    this.option('test', {
      type: String,
      required: false,
      defaults: 'test/',
      desc: 'Source code folder for the tests (relative to the project root)'
    })

    this.option('coverage', {
      type: Boolean,
      required: false,
      defaults: false,
      desc: 'Include code coverage script?'
    })
  },

  writing: {
    pkg: function () {
      var pkg = this.fs.readJSON(this.destinationPath('package.json'), {})
      pkg.scripts = pkg.scripts || {}

      // force the inclusion of these scripts
      // this is because initially "test": "echo no tests"
      pkg.scripts.test = 'ava'
      pkg.scripts['test:watch'] = 'npm test -- --watch'
      if (this.options.coverage) {
        // note that this will only be run on a CI server
        pkg.scripts.coverage = pkg.scripts.coverage || 'nyc npm test && nyc report --reporter=text-lcov > coverage.lcov && codecov'
      }

      // ava configuration
      pkg.ava = pkg.ava || {}
      pkg.ava.require = ['babel-register']

      this.fs.writeJSON('package.json', pkg)
    },

    pkgDeps: function () {
      return this._saveDeps(['ava'])
    },

    gitignore: function () {
      if (this.options.coverage) {
        return this._gitignore(['coverage', '.nyc_output'])
      }
    },

    templates: function () {
      var pkg = this.fs.readJSON(this.destinationPath('package.json'), {})
      var testPath = path.join(this.options.test, 'index.js')
      var srcPath = path.join(this.options.src, 'index.js')
      var relativePath = relative(testPath, srcPath)
      if (relativePath[0] !== '.') {
        relativePath = './' + relativePath
      }

      this.fs.copyTpl(
        this.templatePath('test.tpl'),
        this.destinationPath(testPath), {
          camelName: toCase.camel(pkg.name || this.appname),
          // computes the relative from `test` to `index`
          // e.g.   from test/ to src/index.js = ../src/index.js
          indexPath: relativePath
        }
      )
    }
  },

  default: function () {
    if (this.options.coverage) {
      this._travis({
        before_install: 'npm install codecov && npm install nyc',
        after_success: 'npm run coverage'
      })
    }
  },

  install: function () {
    if (!this.options['skip-install']) {
      this.npmInstall()
    }
  }
})
