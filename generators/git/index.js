'use strict'
var generators = require('yeoman-generator')
var originUrl = require('git-remote-origin-url')
var Promise = require('bluebird')

module.exports = generators.Base.extend({
  constructor: function () {
    generators.Base.apply(this, arguments)
  },

  writing: function () {
    this.fs.copy(
      this.templatePath('gitignore'),
      this.destinationPath('.gitignore')
    )
  }
})

