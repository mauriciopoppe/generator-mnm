'use strict'
var camelCase = require('to-camel-case')
var generators = require('yeoman-generator')

module.exports = generators.Base.extend({
  constructor: function () {
    generators.Base.apply(this, arguments)

    this.option('name', {
      required: true,
      desc: 'The new module name.'
    })
  },

  writing: function () {
    this.fs.copyTpl(
      this.templatePath('index.js'),
      this.destinationPath('lib/index.js'), {
        babel: this.options.babel
      }
    )

    this.fs.copyTpl(
      this.templatePath('test.js'),
      this.destinationPath('test/index.js'), {
        camelName: camelCase(this.options.name)
      }
    )
  }
})
