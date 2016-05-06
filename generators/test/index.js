'use strict'
var camelCase = require('to-camel-case')
var generators = require('yeoman-generator')
var defined = require('defined')
var path = require('path')
var relative = require('relative')

module.exports = generators.Base.extend({
  constructor: function () {
    generators.Base.apply(this, arguments)

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

      // test scripts
      var scripts = pkg.scripts

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

    travis: function () {
      if (this.options.coverage)  {
        this.composeWith('travis', {
          options: {
            config: {
              before_install: 'npm install codecov && npm install nyc',
              after_success: 'npm run coverage'
            }
          }
        }, { local: require.resolve('generator-travis/generators/app') })
      }
    },

    file: function () {
      var pkg = this.fs.readJSON(this.destinationPath('package.json'), {})
      var testIndex = path.join.apply(null, [
        this.options.test,
        'index.js'
      ])

      var relativeSrcIndex = relative(this.options.test, this.options.src + '/index.js')
      if (relativeSrcIndex[0] !== '.') {
        relativeSrcIndex = './' + relativeSrcIndex
      }

      this.fs.copyTpl(
        this.templatePath('test.js'),
        this.destinationPath(testIndex), {
          camelName: camelCase(defined(pkg.name, path.basename(process.cwd()))),
          // computes the relative from `test` to `index`
          // e.g.   from test/ to src/index.js = ../src/index.js
          indexPath: relativeSrcIndex
        }
      )
    }
  },

  install: function () {
    var devDependencies = [ 'ava' ]
    if (!this.options['skip-install']) {
     this.npmInstall(devDependencies, { 'save-dev': true })
    }
  }

})
