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
          presets: ['es2015-rollup']
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
        name: defined(this.options.name, this.pkg.name),
        entry: this.options.entry,
      }
      this.rollup.dest = defined(this.options.dest, 'dist/' + camelCase(this.rollup.name)) + '.js'
    },

    package: function () {
      var merged = extend(true, {
        main: this.options.dest,
        'jsnext:main': this.options.entry,
        scripts: {
          build: 'rollup -c'
        }
      }, this.pkg)
      this.fs.writeJSON(this.destinationPath('package.json'), merged)
    },

    rollupConfig: function () {
      this.fs.copyTpl(
        this.templatePath('rollup.config.js'),
        this.destinationPath('rollup.config.js'),
        this.rollup
      )
    }
  },

  install: function () {
    if (!this.options['skip-install']) {
      this.npmInstall([
        'rollup', 
        'rollup-plugin-babel'
      ], { saveDev: true })
    }
  }
})

