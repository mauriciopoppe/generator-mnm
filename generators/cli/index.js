'use strict'
var extend = require('extend')
var camelCase = require('to-camel-case')
var generators = require('yeoman-generator')

module.exports = generators.Base.extend({
  constructor: function () {
    generators.Base.apply(this, arguments)
  },

  writing: {
    package: function () {
      var pkg = this.fs.readJSON(this.destinationPath('package.json'), {})
      extend(pkg, { bin: 'dist/cli.js' })
      this.fs.writeJSON(this.destinationPath('package.json'), pkg)
    },

    cli: function () {
      var pkg = this.fs.readJSON(this.destinationPath('package.json'))
      this.fs.copyTpl(
        this.templatePath('cli.js'),
        this.destinationPath('lib/cli.js'), {
          camelName: camelCase(pkg.name)
        }
      )
    }
  },

  installs: function () {
    if (!this.options['skip-install']) {
      this.npmInstall(['minimist'], { save: true })
    }  
  }
})
