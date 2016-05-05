'use strict'
var relative = require('relative')
var path = require('path')
var defined = require('defined')
var extend = require('extend')
var camelCase = require('to-camel-case')
var generators = require('yeoman-generator')

module.exports = generators.Base.extend({
  constructor: function () {
    generators.Base.apply(this, arguments)

    this.option('in', {
      type: String,
      required: false,
      defaults: 'bin/index.es6.js',
      desc: 'The location of cli source code'
    })

    this.option('out', {
      type: String,
      required: false,
      defaults: 'bin/index.js',
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

    cli: function () {
      var pkg = this.fs.readJSON(this.destinationPath('package.json'))
      var indexPath = path.join.apply(null, [
        this.destinationRoot(),
        this.options.src
      ])
      var cliPath = path.join.apply(null, [
        this.destinationRoot(),
        this.options.in
      ])

      var indexPath = relative(cliPath, indexPath)
      if (indexPath[0] !== '.') {
        indexPath = './' + indexPath
      }

      this.fs.copyTpl(
        this.templatePath('cli.js'),
        this.destinationPath(cliPath), {
          camelName: camelCase(
            defined(pkg.name, path.basename(process.cwd()))
          ),
          indexPath: indexPath
        }
      )
    }
  },

  installing: function () {
    if (!this.options['skip-install']) {
      this.npmInstall(['yargs'], { save: true })
    }
  }
})
