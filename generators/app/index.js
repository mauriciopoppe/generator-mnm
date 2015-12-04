'use strict'
var generators = require('yeoman-generator')
var chalk = require('chalk')
var yosay = require('yosay')
var extend = require('extend')
var slug = require('to-slug-case')
var camelCase = require('to-camel-case')
var isObject = require('is-object')
var parseAuthor = require('parse-author')
var githubUsername = require('github-username')
var askName = require('inquirer-npm-name')

module.exports = generators.Base.extend({
  constructor: function () {
    generators.Base.apply(this, arguments)
  },

  initializing: function () {
    this.pkg = this.fs.readJSON(this.destinationPath('package.json'), {})

    // Pre set the default props from the information we have at this point
    this.props = {
      name: this.pkg.name,
      description: this.pkg.description,
      version: this.pkg.version,
      homepage: this.pkg.homepage
    }

    if (isObject(this.pkg.author)) {
      this.props.authorName = this.pkg.author.name
      this.props.authorEmail = this.pkg.author.email
      this.props.authorUrl = this.pkg.author.url
    } else if (typeof this.pkg.author === 'string') {
      var info = parseAuthor(this.pkg.author)
      this.props.authorName = info.name
      this.props.authorEmail = info.email
      this.props.authorUrl = info.url
    }
  },

  prompting: {
    welcome: function () {
      this.log(yosay(
        'Welcome to the wonderful ' + chalk.red('mnm') + ' generator!'
      ))
    },

    askForModuleName: function () {
      if (this.pkg.name) {
        this.props.name = this.pkg.name
        return
      }

      var done = this.async()

      askName({
        name: 'name',
        message: 'Module name',
        default: slug(require('path').basename(process.cwd())),
        validate: function (str) {
          return str.length > 0
        }
      }, this, function (name) {
        this.props.name = name
        done()
      }.bind(this))
    },

    askForInfo: function () {
      var done = this.async()
      var prompts = [{
        name: 'description',
        message: 'Module description',
        when: !this.props.description
      }, {
        name: 'homepage',
        message: 'Project homepage url',
        when: !this.props.homepage
      }, {
        name: 'authorName',
        message: "Author's Name",
        when: !this.props.authorName,
        default: this.user.git.name(),
        store: true
      }, {
        name: 'authorEmail',
        message: "Author's Email",
        when: !this.props.authorEmail,
        default: this.user.git.email(),
        store: true
      }, {
        name: 'authorUrl',
        message: "Author's Homepage",
        when: !this.props.authorUrl,
        store: true
      }, {
        name: 'keywords',
        message: 'Keywords (comma to split)',
        when: !this.pkg.keywords,
        filter: function (value) {
          return (value || '').split(',')
            .map(function (el) { return el.trim() })
            .filter(Boolean)
        }
      }]

      this.prompt(prompts, function (props) {
        this.props = extend(this.props, props)
        done()
      }.bind(this))
    },

    askForGithubAccount: function () {
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
    },

    addOn: function () {
      // additional stuff
      // - cli
      // - code coverage
      var done = this.async()
      var prompts = [{
        type: 'confirm',
        name: 'includeCli',
        message: 'Do you need a CLI?',
        when: this.options.cli === undefined,
        default: false
      }, {
        type: 'confirm',
        name: 'includeCodecov',
        message: 'Do you need a code coverage tool?',
        default: false
      }]
      this.prompt(prompts, function (props) {
        this.props = extend(this.props, {
          includeCli: this.options.cli,
          includeCodecov: this.options.codecov
        }, props)
        done()
      }.bind(this))
    }
  },

  default: function () {
    var distFile = 'dist/' + camelCase(this.props.name) + '.js'
    // taken from the awesome https://github.com/bucaran/generator-rise/blob/master/app/index.js
    this.composeWith('travis', {
      options: { 
        config: {
          before_script: ['npm run lint'],
          script: ['npm run build'],
          after_script: ['npm run codecov']  
        } 
      }
    }, {
      local: require.resolve('generator-travis/generators/app')
    })

    this.composeWith('mnm:rollup', {
      options: { 
        'skip-install': this.options['skip-install'],
        dest: distFile
      },
    }, {
      local: require.resolve('../rollup')
    })

    this.composeWith('git-init', {}, {
      local: require.resolve('generator-git-init/generators/app')
    })
    
    if (!this.pkg.license) {
      this.composeWith('license', {
        options: {
          name: this.props.authorName,
          email: this.props.authorEmail,
          website: this.props.authorUrl
        }
      }, {
        local: require.resolve('generator-license/app')
      })
    }

    this.composeWith('mnm:boilerplate', {
      options: { }
    }, {
      local: require.resolve('../boilerplate')
    })

    this.composeWith('mwm:git', {
      options: { }
    }, {
      local: require.resolve('../git')
    })

    if (this.props.includeCli) {
      this.composeWith('mnm:cli', {
        options: {
          cli: 'bin/cli.js',
          index: distFile,
          'skip-install': this.options['skip-install']
        }
      }, {
        local: require.resolve('../cli')
      })
    }

    if (!this.fs.exists(this.destinationPath('README.md'))) {
      this.composeWith('mnm:readme', {
        options: {
          name: this.props.name,
          description: this.props.description,
          githubAccount: this.props.githubAccount,
          author: this.props.authorName,
          website: this.props.authorUrl,
          codecov: this.props.includeCodecov
        }
      }, {
        local: require.resolve('../readme')
      })
    }
  },

  writing: function () {
    // Re-read the content at this point because a composed generator might modify it.
    var currentPkg = this.fs.readJSON(this.destinationPath('package.json'), {})
    var repositoryUrl = 'https://github.com/' + this.props.githubAccount + '/' + slug(this.props.name)
    var pkg = {
      name: slug(this.props.name),
      version: '0.0.0',
      description: this.props.description,
      homepage: this.props.homepage || repositoryUrl,
      author: {
        name: this.props.authorName,
        email: this.props.authorEmail,
        url: this.props.authorUrl
      },
      bugs: {
        url: repositoryUrl + '/issues'
      },
      // main set in generators/rollup
      keywords: this.props.keywords,
      scripts: {},
      standard: {
        ignore: ['dist/']
      }
    }

    // scripts
    extend(pkg.scripts, {
      // utils
      lint: 'standard',
      codecov: 'npm run test:coverage -s && codecov < coverage/lcov.info',
      postcodecov: 'rimraf coverage',

      // tests
      test: 'babel-tape-runner test | tap-spec',
      'test:coverage': 'babel-node node_modules/.bin/isparta cover test/',
      'test:watch': "watch 'npm test' test lib",

      // build is in generators/rollup

      // deploy (preversion is used instead of prepublish)
      preversion: 'npm run lint -s && npm run test -s && npm run build -s',
      postversion: 'git push origin master --follow-tags',
      deploy: 'git pull --rebase origin master && git push origin master'
    })

    // Let's extend package.json so we're not overwriting user previous fields
    this.fs.writeJSON('package.json', extend(true, pkg, currentPkg))
  },

  installs: function () {
    var devDependencies = [
      'tape',
      'tap-spec',
      'babel-tape-runner',
      'watch',
      'standard',
      'rimraf'
    ]
    if (this.props.includeCodecov) {
      devDependencies.push('isparta', 'codecov.io')
    }
    this.npmInstall(devDependencies, { 'save-dev': true })
  }
})
