var yeoman = require('yeoman-generator')
var extend = require('extend')
var sortedObject = require('sorted-object')
var depsObject = require('deps-object')
var yaml = require('yamljs')

module.exports = yeoman.Base.extend({
  _saveDepsToPkg: function (deps) {
    var pkg = this.fs.readJSON(this.destinationPath('package.json'), {})
    var currentDeps = pkg.devDependencies || {}
    var mergedDeps = extend({}, currentDeps, deps)
    var sortedDeps = sortedObject(mergedDeps)
    pkg.devDependencies = sortedDeps
    this.fs.writeJSON(this.destinationPath('package.json'), pkg)
  },

  _saveDeps: function (deps) {
    return depsObject(deps)
      .then(function (devDependencies) {
        this._saveDepsToPkg(devDependencies)
      }.bind(this))
      .catch(function (err) { throw err })
  },

  _travis: function (additional) {
    var travisPath = this.destinationPath('.travis.yml')
    var existing = this.fs.exists(travisPath)
            ? yaml.parse(this.fs.read(travisPath))
            : {}
    var result = Object.assign({
      language: 'node_js',
      node_js: ['stable']
    }, existing, additional)

    this.fs.write(
      this.destinationPath('.travis.yml'),
      yaml.stringify(result, 3, 2)
    )
  },

  _gitignore: function (ignores) {
    var giPath = this.destinationPath('.gitignore')
    var file = this.fs.read(giPath, { defaults: '' })
    ignores.forEach(function (v) {
      if (file.indexOf(v) === -1) {
        file += v + '\n'
      }
    })
    this.fs.write(giPath, file)
  }
})
