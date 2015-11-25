'use strict'
var camelCase = require('to-camel-case')
var slugCase = require('to-slug-case')
var generators = require('yeoman-generator')
var isObject = require('is-object')
var extend = require('extend')
var defined = require('defined')

module.exports = generators.Base.extend({
  constructor: function () {
    generators.Base.apply(this, arguments)

    this.option('name', {
      type: String,
      required: false,
      desc: 'Module name'
    })

    this.option('description', {
      type: String,
      required: false,
      desc: 'Module description'
    })

    this.option('githubAccount', {
      type: String,
      required: false,
      desc: 'GitHub account'
    })

    this.option('license', {
      type: String,
      required: false,
      desc: 'License'
    })

    this.option('author', {
      type: String,
      required: false,
      desc: 'Author'
    })

    this.option('website', {
      type: String,
      required: false,
      desc: 'Website'
    })

    this.option('coveralls', {
      type: Boolean,
      required: false,
      desc: 'Include the coveralls badge'
    })
  },

  initializing: function () {
    var pkg = this.fs.readJSON(this.destinationPath('package.json'), {})
    var authorInfo = {}

    // package.json might exist, recover some properties
    this.props = {}

    if (isObject(pkg.author)) {
      authorInfo = pkg.author
    } else if (typeof pkg.author === 'string') {
      authorInfo = parseAuthor(pkg.author)
    }

    this.props.authorName = defined(authorInfo.name, this.options.author)
    this.props.authorEmail = authorInfo.email
    this.props.authorUrl = defined(authorInfo.url, this.options.website)
  },

  prompting: {
    badges: function () {
      var done = this.async()
      this.prompt([{
        type: 'checkbox',
        name: 'badges',
        message: 'Select the badges that you want in your README',
        choices: [{
          name: 'npm',
          checked: true
        }, {
          name: 'travis',
          checked: true
        }, {
          name: 'coveralls',
          checked: this.options.coveralls
        }, {
          name: 'david'
        }, {
          name: 'downloads'
        }],
        default: ['npm', 'travis']
      }], function (props) {
        this.props = extend(this.props, props)
        done()
      }.bind(this))
    },

    askForGithubAccount: function () {
      if (this.options.githubAccount) {
        this.props.githubAccount = this.options.githubAccount
        return
      }

      var done = this.async()
      githubUsername(this.props.authorEmail, function (err, username) {
        if (err) { console.error(err) }
        this.prompt({
          name: 'githubAccount',
          message: 'GitHub username or organization',
          default: username
        }, function (prompt) {
          this.props.githubAccount = prompt.githubAccount
          done()
        }.bind(this))
      }.bind(this))
    }
  },

  writing: function () {
    // package.json might have been modified/created in another generator
    var pkg = this.fs.readJSON(this.destinationPath('package.json'), {})

    this.props = extend(this.props, {
      name: defined(pkg.name, this.options.name),
      description: defined(pkg.description, this.options.description),
      license: defined(pkg.license, this.options.licence, 'MIT')
    })
    this.props.slugName = slugCase(this.props.name)
    this.props.camelName = camelCase(this.props.name)
    this.fs.copyTpl(
      this.templatePath('README.md'),
      this.destinationPath('README.md'),
      this.props
    )
  }
})
