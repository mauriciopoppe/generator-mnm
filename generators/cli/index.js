'use strict'
var path = require('path')
var toCase = require('to-case')
var relative = require('relative')
var defined = require('defined')

var Base = require('../base')

module.exports = Base.extend({
  constructor: function () {
    Base.apply(this, arguments)

    this.option('in', {
      type: String,
      required: false,
      defaults: 'bin/index.js',
      desc: 'The location of cli source code'
    })

    this.option('out', {
      type: String,
      required: false,
      defaults: 'bin/index.es5.js',
      desc: 'The path to your cli written in the bin property of package.json'
    })

    this.option('src', {
      type: String,
      required: false,
      defaults: 'dist/index.js',
      desc: 'The location of the project\'s source file'
    })
  },

  writing: {
    pkg: function () {
      var pkg = this.fs.readJSON(this.destinationPath('package.json'), {})
      pkg.scripts = pkg.scripts || {}
      pkg.scripts['build:cli'] = pkg.scripts['build:cli'] || 'babel ' + this.options.in + ' -o ' + this.options.out

      // pkg.bin value
      //  - pkg.bin if pkb.bin was already in package.json
      //  - options.bin (an override to options.cli, useful when the cli file
      //  is transpiled)
      pkg.bin = defined(pkg.bin, this.options.out, this.options.in)
      this.fs.writeJSON(this.destinationPath('package.json'), pkg)
    },

    pkgDeps: function () {
      return this._saveDeps(['yargs'])
    },

    cli: function () {
      var pkg = this.fs.readJSON(this.destinationPath('package.json'), {})
      var cliPath = this.options.in
      var srcPath = this.options.src
      var relativePath = relative(cliPath, srcPath)
      if (relativePath[0] !== '.') {
        relativePath = './' + relativePath
      }

      this.fs.copyTpl(
        this.templatePath('cli.tpl'),
        this.destinationPath(cliPath), {
          camelName: toCase.camel(pkg.name || this.appname),
          indexPath: relativePath
        }
      )
    }
  },

  install: function () {
    if (!this.options['skip-install']) {
      this.npmInstall()
    }
  }
})
