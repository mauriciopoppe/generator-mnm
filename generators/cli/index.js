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

    this.option('name', {
      type: String,
      required: false,
      desc: 'The module name'
    })

    this.option('cli', {
      type: String,
      required: false,
      defaults: 'bin/cli.js',
      desc: 'The location of your cli'
    })

    this.option('bin', {
      type: String,
      required: false,
      defaults: undefined,
      desc: 'The path to your cli written in the bin property of package.json'
    })

    this.option('index', {
      type: String,
      required: false,
      defaults: 'lib/index.js',
      desc: 'The location of the project\'s index file'
    })
  },

  writing: {
    package: function () {
      var pkg = this.fs.readJSON(this.destinationPath('package.json'), {})
      // value
      //  - pkg.bin if pkb.bin was already in package.json
      //  - options.bin (an override to options.cli, useful when the cli file
      //  is transpiled)
      pkg.bin = defined(pkg.bin, this.options.bin, this.options.cli)
      this.fs.writeJSON(this.destinationPath('package.json'), pkg)
    },

    cli: function () {
      var pkg = this.fs.readJSON(this.destinationPath('package.json'))
      var indexPath = path.join.apply(null, [
        this.destinationRoot(),
        this.options.index
      ])
      var cliPath = path.join.apply(null, [
        this.destinationRoot(),
        this.options.cli
      ])

      var indexPath = relative(cliPath, indexPath)
      if (indexPath[0] !== '.') {
        indexPath = './' + indexPath
      }

      this.fs.copyTpl(
        this.templatePath('cli.js'),
        this.destinationPath(cliPath), {
          camelName: camelCase(defined(this.options.name, pkg.name, 'indexFile')),
          indexPath: indexPath
        }
      )
    }
  },

  installs: function () {
    if (!this.options['skip-install']) {
      this.npmInstall(['yargs'], { save: true })
    }  
  }
})
