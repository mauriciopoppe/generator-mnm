'use strict'
var relative = require('relative')
var path = require('path')
var defined = require('defined')
var extend = require('extend')
var camelCase = require('to-camel-case')
var generators = require('yeoman-generator')

module.exports = generators.Base.extend({
  constructor: function () {
    generators.Base.apply(this, arguments)

    this.option('entry', {
      type: String,
      required: false,
      defaults: 'lib/index.js',
      desc: 'The location of the project\'s index file'
    })

    this.option('name', {
      type: String,
      required: false,
      desc: 'The module name'
    })

    this.option('dest', {
      type: String,
      required: false,
      desc: 'The location of the bundled file'
    })
  },

  default: function () {

    this.composeWith('babel', {
      options: { 
        'skip-install': this.options['skip-install'],
        config: {
          presets: ['es2015'],
          plugins: ['transform-es2015-modules-umd']
        }
      },
    }, {
      local: require.resolve('generator-babel/generators/app')
    })
  },

  writing: {
    default: function () {
      this.pkg = this.fs.readJSON(this.destinationPath('package.json'), {})
      this.rollup = {
        name: camelCase(defined(this.options.name, this.pkg.name)),
        entry: this.options.entry,
      }
      this.rollup.dest = defined(this.options.dest, 'dist/' + this.rollup.name + '.js')
    },

    package: function () {
      var merged = extend(true, this.pkg, {
        main: this.options.dest,
        'jsnext:main': this.options.entry,
        scripts: {
          clean: 'rimraf dist',
          prebuild: 'npm run clean -s',
          build: 'rollup -c',
          'build:watch': "watch 'npm run build' lib"
        }
      })
      this.fs.writeJSON(this.destinationPath('package.json'), merged)
    },

    rollupConfig: function () {
      this.fs.copyTpl(
        this.templatePath('build.js'),
        this.destinationPath('tasks/build.js'),
        this.rollup
      )
    }
  },

  install: function () {
    if (!this.options['skip-install']) {
      this.npmInstall([
        'watch',
        'rimraf',
        'rollup'
      ], { 'save-dev': true })
    }
  }
})

