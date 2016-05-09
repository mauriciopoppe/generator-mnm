'use strict'
var path = require('path')

var Base = require('../base')

module.exports = Base.extend({
  constructor: function () {
    Base.apply(this, arguments)

    this.option('src', {
      type: String,
      required: false,
      defaults: 'src/',
      desc: 'Source folder'
    })

    this.option('dist', {
      type: String,
      required: false,
      defaults: 'dist/',
      desc: 'Dist folder (after compilation with Babel)'
    })
  },

  writing: {
    pkgScripts: function () {
      function setTask (name, task) {
        scripts[name] = scripts[name] || task
      }

      var pkg = this.fs.readJSON(this.destinationPath('package.json'), {})
      var distPath = path.join(this.options.dist, 'index.js')
      var srcPath = path.join(this.options.src, 'index.js')
      var buildScript = 'babel ' + srcPath + ' --out-file ' + distPath
      var scripts = pkg.scripts || {}
      setTask('clean', 'rimraf ' + this.options.dist + ' && mkdirp ' + this.options.dist)
      setTask('lint', 'standard')
      setTask('prebuild', 'npm run clean -s && npm run lint -s')
      setTask('build', buildScript)
      setTask('build:watch', 'npm run build -- --watch')
      // instead of runnning this on prepublish which doesn't work as expecte on
      // npm@3 run it on preversion, this is because it's highly unlikely to do
      // something after `npm version`
      setTask('preversion', 'npm run build')
      pkg.scripts = scripts

      // standard ignores
      // no need to ignore this.options.dist since it honors .gitignore

      // `files` is like !.npmignore, i.e. the strategy is to ignore everything
      // but what's included on this field
      //
      // include dist/ (ignored in .gitignore but added through `files`)
      // include src/ (jsnext:main compatibility)
      pkg.files = pkg.files || []

      var files = [this.options.src, this.options.dist]
      files.forEach(function (path) {
        if (pkg.files.indexOf(path) === -1) {
          pkg.files.push(path)
        }
      })
      this.fs.writeJSON(this.destinationPath('package.json'), pkg)
    },

    pkgDeps: function () {
      return this._saveDeps(['rimraf', 'mkdirp', 'standard'])
    },

    templates: function () {
      var srcPath = path.join(this.options.src, 'index.js')

      // copy template to this.options.src
      this.fs.copyTpl(
        this.templatePath('index.tpl'),
        this.destinationPath(srcPath), {}
      )
    },

    gitignore: function () {
      this._gitignore([this.options.dist])
    }
  },

  default: function () {
    this.composeWith('travis', {
      options: {
        'skip-install': this.options['skip-install'],
        config: {
          script: 'npm run build'
        }
      }
    }, { local: require.resolve('generator-travis/generators/app') })

    this.composeWith('babel', {
      options: {
        'skip-install': this.options['skip-install'],
        config: {
          plugins: ['add-module-exports'],
          sourceMaps: true
        }
      }
    }, { local: require.resolve('generator-babel/generators/app') })
  },

  install: function () {
    if (!this.options['skip-install']) {
      this.npmInstall()
    }
  }
})
