'use strict'
var camelCase = require('to-camel-case')
var slugCase = require('to-slug-case')
var generators = require('yeoman-generator')
var extend = require('xtend')

module.exports = generators.Base.extend({
  constructor: function () {
    generators.Base.apply(this, arguments)
  },

  writing: function () {
    this.fs.copy(
      this.templatePath('gitignore'),
      this.destinationPath('.gitignore')
    )
    this.fs.copy(
      this.templatePath('gitattributes'),
      this.destinationPath('.gitattributes')
    )
  }
})
