'use strict'
var camelCase = require('to-camel-case')
var generators = require('yeoman-generator')
var defined = require('defined')
var path = require('path')
var relative = require('relative')

module.exports = generators.Base.extend({
  constructor: function () {
    generators.Base.apply(this, arguments)

    this.option('index', {
      type: String,
      required: false,
      defaults: 'src/index.js',
      desc: 'The destination of the index file'
    })

    this.option('test', {
      type: String,
      required: false,
      defaults: 'test/index.js',
      desc: 'The destination of the test file'
    })
  },

  writing: function () {
    // generates
    //  lib/index.js
    //  test/index.js
    var pkg = this.fs.readJSON(this.destinationPath('package.json'), {})
    var indexPath = path.join.apply(null, [
      this.destinationRoot(),
      this.options.index
    ])
    var testPath = path.join.apply(null, [
      this.destinationRoot(),
      this.options.test
    ])

    this.fs.copyTpl(
      this.templatePath('index.js'),
      this.destinationPath(indexPath), { }
    )

    var indexPath = relative(testPath, indexPath)
    if (indexPath[0] !== '.') {
      indexPath = './' + indexPath
    }

    this.fs.copyTpl(
      this.templatePath('test.js'),
      this.destinationPath(testPath), {
        camelName: camelCase(defined(this.options.name, pkg.name, 'placeModuleNameHere')),
        // computes the relative from `test` to `index`
        // e.g.   from test/ to lib/index.js = ../lib/index.js
        indexPath: indexPath
      }
    )
  }
})

