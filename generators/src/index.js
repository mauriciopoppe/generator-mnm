'use strict'
var camelCase = require('to-camel-case')
var generators = require('yeoman-generator')
var defined = require('defined')
var path = require('path')
var relative = require('relative')

module.exports = generators.Base.extend({
  constructor: function () {
    generators.Base.apply(this, arguments)

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
    pkg: function () {
      var pkg = this.fs.readJSON(this.destinationPath('package.json'), {})

      var distIndex = path.join.apply(null, [
        this.options.dist,
        'index.js'
      ])
      var buildScript = 'babel ' + this.options.src + ' --out-file ' + distIndex
      var scripts = pkg.scripts || {}
      function setTask(name, task) {
        scripts[name] = scripts[name] || task
      }
      setTask('clean', 'rimraf ' + this.options.dist + ' && mkdirp ' + this.options.dist)
      setTask('lint', 'standard')
      setTask('prebuild', 'npm run clean -s && npm run lint -s')
      setTask('build', buildScript)
      setTask('build:watch', 'npm run build -- --watch')
      pkg.scripts = scripts

      // standard ignores
      pkg.standard = {
        ignore: ['/bin']
      }

      this.fs.writeJSON('package.json', pkg)
    },

    file: function () {
      var pkg = this.fs.readJSON(this.destinationPath('package.json'), {})
      var srcIndex = path.join(this.options.src, 'index.js')

      // copy template to this.options.src
      this.fs.copyTpl(
        this.templatePath('index.js'),
        this.destinationPath(srcIndex), { }
      )
    },

    gitignore: function () {
      // appends node_modules to .gitignore
      var giPath = this.destinationPath('.gitignore')
      var file = this.fs.read( giPath, { defaults: '' })
      if (file.indexOf('node_modules') === -1) { file += 'node_modules\n' }
      this.fs.write(giPath, file)
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
            plugins: ['add-module-exports']
          }
        },
      }, { local: require.resolve('generator-babel/generators/app') })
    }
  },

  install: function () {
    if (!this.options['skip-install']) {
      this.npmInstall(['rimraf', 'mkdirp', 'standard'], { 'save-dev': true })
    }
  }
})
