'use strict'
var defined = require('defined')
var extend = require('extend')
var toCase = require('to-case')
var githubUsername = require('github-username')
var normalizeUrl = require('normalize-url')
var isUrl = require('is-url')
var mkdirp = require('mkdirp')

var Base = require('../base')

module.exports = Base.extend({
  constructor: function () {
    Base.apply(this, arguments)

    this.argument('name', {
      type: String,
      required: false,
      desc: [
        'module name',
        'If provided the module will be created inside ./myAwesomeModule/',
        'otherwise it will be created in the current directory',
        '',
        'Examples:',
        '',
        '   $ yo mnm',
        '   $ yo mnm myAwesomeModule',
        '',
        ''
      ].join('\n  ')
    })

    this.option('all', {
      type: Boolean,
      required: false,
      alias: 'a',
      default: false,
      desc: 'Ask all questions'
    })

    this.option('yes', {
      type: Boolean,
      required: false,
      alias: 'y',
      default: false,
      desc: 'Skip some questions, like $ npm init -y'
    })

    // TODO: performant npm
    // this.option('performant', {
    //   type: Boolean,
    //   required: false,
    //   alias: 'p',
    //   default: false,
    //   desc: 'Install with pnpm instead of npm, make sure you have pnpm installed'
    // })
  },

  initializing: function () {
    this.savedAnswers = this._globalConfig.getAll().promptValues || {}
    this.shouldSkipAll = this.options.yes
    this.shouldAskAll = this.options.all
    var defaults = extend({}, this.savedAnswers, {
      moduleName: toCase.slug(this.name || this.appname),
      moduleDescription: '',
      moduleKeywords: '',
      moduleLicense: 'MIT',
      coverage: true,
      // additional not configurable props
      src: 'src/',
      dist: 'dist/',
      test: 'test/'
    })
    this.props = extend({}, defaults)
    if (this.shouldSkipAll && this.shouldAskAll) {
      this.log('You have chosen to ask both "all" and "minimum" questions!\n')
      return
    }
  },

  _checkEmpty: function (message) {
    return function (v) {
      if (!v.length) { return message }
      return true
    }
  },

  _checkUrl: function (urlMessage) {
    return function (v) {
      if (v.length && !isUrl(normalizeUrl(v))) return urlMessage
      return true
    }
  },

  _shouldAskUserInfo: function (prop) {
    return this.shouldAskAll || !defined(this.savedAnswers[prop])
  },

  prompting: {
    userInfo: function () {
      var prompts = [{
        name: 'name',
        message: 'Your name:',
        when: this._shouldAskUserInfo('name'),
        validate: this._checkEmpty('Your name is required'),
        store: true
      }, {
        name: 'email',
        message: 'Your email:',
        when: this._shouldAskUserInfo('email'),
        validate: this._checkEmpty('Your email is required'),
        store: true
      }, {
        name: 'website',
        message: 'Your website:',
        when: this._shouldAskUserInfo('website'),
        validate: this._checkUrl('The input is not a valid url'),
        filter: function (v) {
          if (v.indexOf('.') === -1) return v
          return normalizeUrl(v)
        },
        required: false,
        store: true
      }]

      var done = this.async()
      this.prompt(prompts, function (props) {
        extend(this.props, props)
        if (this.props.website) {
          this.props.website = normalizeUrl(this.props.website)
        }
        done()
      }.bind(this))
    },

    askForGithubAccount: function () {
      var self = this
      var done = this.async()
      githubUsername(this.props.email, function (err, username) {
        if (err) throw (err)
        self.prompt({
          name: 'githubUsername',
          message: 'Your github username:',
          when: self._shouldAskUserInfo('githubUsername'),
          store: true
        }, function (answers) {
          extend(self.props, answers)
          done()
        })
      })
    },

    moduleInfo: function () {
      var self = this
      var done = this.async()
      this.prompt([{
        name: 'moduleName',
        message: 'Module name:',
        default: this.props.moduleName,
        validate: this._checkEmpty('Module name required'),
        when: !this.shouldSkipAll,
        filter: function (v) {
          return toCase.slug(v || '')
        }
      }, {
        name: 'moduleDescription',
        message: 'Module description:',
        validate: this._checkEmpty('Module description required'),
        when: !this.shouldSkipAll
      }, {
        name: 'moduleKeywords',
        message: 'Module keywords (comma to split):',
        when: !this.shouldSkipAll,
        filter: function (value) {
          return (value || '').split(',')
            .map(function (el) { return el.trim() })
            .filter(Boolean)
        }
      }, {
        name: 'moduleLicense',
        message: 'License:',
        default: this.props.moduleLicense,
        when: !this.shouldSkipAll
      }], function (answers) {
        extend(self.props, answers)
        done()
      })
    },

    addOns: function () {
      // additional stuff
      // - cli
      // - code coverage
      var prompts = [{
        // type: 'confirm',
        // name: 'cli',
        // message: '❯ do you need a cli?',
        // when: this.options.cli === undefined,
        // default: false
      // }, {
        type: 'confirm',
        name: 'coverage',
        message: 'Do you need code coverage?',
        when: !this.shouldSkipAll,
        default: this.props.coverage
      }]
      var done = this.async()
      this.prompt(prompts, function (answers) {
        extend(this.props, answers)
        done()
      }.bind(this))
    }
  },

  writing: {
    pkg: function () {
      if (this.name) {
        // if the argument `name` is given create the project inside it
        mkdirp(this.props.moduleName)
        this.destinationRoot(this.destinationPath(this.props.moduleName))
      }

      // check if there's an existing package.json
      var currentPkg = this.fs.readJSON(this.destinationPath('package.json'), {})
      var pkg = {
        name: this.props.moduleName,
        version: '0.0.0',
        description: this.props.moduleDescription,
        license: this.props.moduleLicense,
        author: {
          name: this.props.name,
          email: this.props.email,
          url: this.props.website
        },
        main: this.props.dist + this.props.moduleName + '.js',
        module: this.props.dist + this.props.moduleName + '.mjs',
        'jsnext:main': this.props.dist + this.props.moduleName + '.mjs',
        keywords: this.props.moduleKeywords,
        repository: this.props.githubUsername + '/' + this.props.moduleName,
        scripts: {},
        dependencies: {},
      }

      // Let's extend package.json so we're not overwriting user previous fields
      this.fs.writeJSON('package.json', extend(true, pkg, currentPkg))
    },

    gitignore: function () {
      this._gitignore(['.DS_Store', 'node_modules'])
    }
  },

  default: function () {
    // git init
    this.composeWith('git-init', {}, {
      local: require.resolve('generator-git-init/generators/app')
    })

    // src/index.js and test/index.js
    this.composeWith('mnm:src', {
      options: {
        src: this.props.src,
        dist: this.props.dist,
        'skip-install': this.options['skip-install']
      }
    }, { local: require.resolve('../src') })

    this.composeWith('mnm:test', {
      options: {
        src: this.props.src,
        test: this.props.test,
        coverage: this.props.coverage,
        'skip-install': this.options['skip-install'],
      }
    }, { local: require.resolve('../test') })

    // TODO: make the generator receive a license field
    // if (!this.shouldSkipAll) {
      // this.composeWith('license', {
      //   options: {
      //     name: this.props.name,
      //     email: this.props.email,
      //     website: this.props.website
      //   },
      //   prompts: {license: 'MIT'}
      // }, { local: require.resolve('generator-license/app') })
    // }

    if (!this.fs.exists(this.destinationPath('README.md'))) {
      this.composeWith('mnm:readme', {
        options: {
          githubUsername: this.props.githubUsername,
          codecov: this.props.coverage,
          yes: this.shouldSkipAll
        }
      }, { local: require.resolve('../readme') })
    }
  }

})
