'use strict'
var camelCase = require('to-camel-case')
var generators = require('yeoman-generator')
var defined = require('defined')

module.exports = generators.Base.extend({
  constructor: function () {
    generators.Base.apply(this, arguments)

    this.option('name', {
      required: false,
      desc: 'The new module name.'
    })
  },

  writing: function () {
    var pkg = this.fs.readJSON(this.destinationPath('package.json'), {})
    this.fs.copyTpl(
      this.templatePath('index.js'),
      this.destinationPath('lib/index.js'), { }
    )

    this.fs.copyTpl(
      this.templatePath('test.js'),
      this.destinationPath('test/index.js'), {
        camelName: camelCase(defined(this.options.name, pkg.name))
      }
    )
  }
})
