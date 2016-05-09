'use strict'
var toCase = require('to-case')
var extend = require('extend')
var parseAuthor = require('parse-author')

var Base = require('../base')

module.exports = Base.extend({
  constructor: function () {
    Base.apply(this, arguments)

    this.option('codecov', {
      type: Boolean,
      required: false,
      default: false,
      desc: 'Include the codecov badge'
    })
  },

  initializing: function () {
    this.shouldSkipAll = this.options.yes
    this.props = {
      badges: ['npm', 'travis', this.options.codecov && 'codecov'].filter(Boolean)
    }
  },

  prompting: {
    badges: function () {
      var done = this.async()
      this.prompt({
        type: 'checkbox',
        name: 'badges',
        message: 'Select the badges that you want in your README',
        choices: [
          { name: 'npm' },
          { name: 'travis' },
          { name: 'codecov' },
          { name: 'david' },
          { name: 'downloads' }
        ],
        default: this.props.badges,
        when: !this.shouldSkipAll
      }, function (answers) {
        extend(this.props, answers)
        done()
      }.bind(this))
    }
  },

  writing: function () {
    var pkg = this.fs.readJSON(this.destinationPath('package.json'), {})
    var authorInfo
    if (pkg.author && typeof pkg.author === 'object') {
      authorInfo = pkg.author
    } else if (typeof pkg.author === 'string') {
      authorInfo = parseAuthor(pkg.author)
    } else {
      authorInfo = {}
    }

    // get githubUsername from repository field
    // assume for simplicity that the field has the form
    //
    //    githubUsername/moduleName
    //
    var githubUsername = (pkg.repository || '').split('/')[0]

    extend(this.props, {
      name: authorInfo.name || '',
      email: authorInfo.email || '',
      website: authorInfo.url || '',
      githubUsername: githubUsername,
      moduleName: (pkg.name || this.appname),
      moduleDescription: pkg.description || '',
      moduleLicense: pkg.license || ''
    })
    this.props.camelModuleName = toCase.camel(this.props.moduleName)
    this.fs.copyTpl(
      this.templatePath('README.tpl'),
      this.destinationPath('README.md'),
      this.props
    )
  }
})

