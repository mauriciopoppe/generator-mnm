'use strict'
var yeoman = require('yeoman-generator')
var chalk = require('chalk')
var yosay = require('yosay')
var path = require('path')
var extend = require('xtend')
var slug = require('to-slug-case')

module.exports = yeoman.generators.Base.extend({
  initializing: function () {
    this.pkg = require('../package.json')
    this.currentYear = new Date().getFullYear()
    this.currentDate = new Date().toISOString().slice(0, 10)
  },

  prompting: {
    welcome: function () {
      // Have Yeoman greet the user.
      this.log(yosay(
        'Welcome to the wonderful ' + chalk.red('NodeNpm') + ' generator!'
      ))
    },

    packageJson: function () {
      var done = this.async()
      var prompts = [{
        name: 'name',
        message: 'Module name',
        default: path.basename(process.cwd())
      }, {
        name: 'description',
        message: 'Description',
        default: 'The best module ever.'
      }, {
        name: 'homepage',
        message: 'Homepage'
      }, {
        name: 'license',
        message: 'License',
        default: 'MIT'
      }, {
        name: 'username',
        message: 'GitHub username',
        store: true
      }, {
        name: 'authorName',
        message: "Author's Name",
        store: true
      }, {
        name: 'authorEmail',
        message: "Author's Email",
        store: true
      }, {
        name: 'authorUrl',
        message: "Author's Homepage",
        store: true
      }, {
        name: 'keywords',
        message: 'Key your keywords (comma to split)'
      }]
      this.prompt(prompts, function (props) {
        this.slugname = slug(props.name)
        this.safeSlugname = this.slugname.replace(/-+([a-zA-Z0-9])/g, function (g) {
          return g[1].toUpperCase()
        })

        this.props = extend(props, {
          keywords: (props.keywords || '').split(',')
            .map(function (el) {
              return el.trim()
            })
            .filter(function (el) {
              return !!el
            }),
          repoUrl: props.username
            ? 'https://github.com/' + props.username + '/' + this.slugname
            : 'user/repo'
        })

        done()
      }.bind(this))
    },

    projectSpecific: function () {
      var done = this.async()
      this.log(
        '\nAlmost done :)' +
          '\nTell me specific things about your new project')
        var prompts = [{
          type: 'confirm',
          name: 'cli',
          message: 'Do you need a CLI?',
          default: false
        }, {
          type: 'confirm',
          name: 'codeCoverage',
          message: 'Do you need a code coverage tool? (Powered by istanbul + coveralls)',
          default: false
        }]
        this.prompt(prompts, function (props) {
          this.config = extend({}, props)
          done()
        }.bind(this))
    }
  },

  writing: {
    compose: function () {
      this.composeWith('babel', { options: {
        'skip-install': this.options.skipInstall
      }}, {
        local: require.resolve('generator-babel/generators/app')
      })
    },

    app: function () {
      this.fs.copyTpl(
        this.templatePath('test/index.js'),
        this.destinationPath('test/index.js'),
        this
      )
      this.fs.copyTpl(
        this.templatePath('src/index.js'),
        this.destinationPath('src/index.js'),
        this
      )
      this.fs.copy(
        this.templatePath('gitignore'),
        this.destinationPath('.gitignore')
      )
      this.fs.copy(
        this.templatePath('npmignore'),
        this.destinationPath('.npmignore')
      )
      this.fs.copyTpl(
        this.templatePath('_package.json'),
        this.destinationPath('package.json'),
        this
      )
      this.fs.copyTpl(
        this.templatePath('_travis.yml'),
        this.destinationPath('.travis.yml'),
        this
      )
      this.fs.copyTpl(
        this.templatePath('README.md'),
        this.destinationPath('README.md'),
        this
      )

      if (this.config.cli) {
        this.fs.copyTpl(
          this.templatePath('bin/cli.js'),
          this.destinationPath('bin/' + this.safeSlugname),
          this
        )
      }
    },
  },

  install: function () {
    var devDependencies = [
      'tape',
      'babel-tape-runner',
      'tap-spec',
      'watch',
      'standard'
    ]
    if (this.config.codeCoverage) {
      devDependencies.push('isparta')
    }
    this.npmInstall(devDependencies, { 'save-dev': true })

    var dependencies = []
    if (this.config.cli) {
      dependencies.push('yargs')
    }
    this.npmInstall(dependencies, { 'save': true })
  }
})
