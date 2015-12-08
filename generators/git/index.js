'use strict'
var generators = require('yeoman-generator')
var originUrl = require('git-remote-origin-url')

module.exports = generators.Base.extend({
  constructor: function () {
    generators.Base.apply(this, arguments)

    this.option('github-account', {
      type: String,
      required: true,
      desc: 'GitHub username or organization'
    })
  },

  initializing: function () {
    var done = this.async()

    originUrl(this.destinationPath(''), function (err, url) {
      this.originUrl = url
      done()
    }.bind(this))
  },

  writing: function () {
    this.pkg = this.fs.readJSON(this.destinationPath('package.json'), {})
    
    this.fs.copy(
      this.templatePath('gitignore'),
      this.destinationPath('.gitignore')
    )
    this.fs.copy(
      this.templatePath('gitattributes'),
      this.destinationPath('.gitattributes')
    )

    var repository = ''
    if (this.originUrl) {
      repository = this.originUrl
    } else {
      repository = this.options.githubAccount + '/' + this.options.name
    }
    this.pkg.repository = this.pkg.repository || repository
    this.fs.writeJSON(this.destinationPath('package.json'), this.pkg)
  }

})
