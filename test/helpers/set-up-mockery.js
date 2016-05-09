var mockery = require('mockery')
var helpers = require('yeoman-test')
var depsObject = require('deps-object') 
var Promise = require('pinkie-promise')

module.exports = function (before, after) {
  before(function () {
    mockery.enable({
      warnOnUnregistered: false
    })

    mockery.registerMock('npm-name', function (name, cb) {
      cb(null, true)
    })

    mockery.registerMock('github-username', function (name, cb) {
      cb(null, 'unicornUser')
    })

    mockery.registerMock(
      require.resolve('generator-license/app'),
      helpers.createDummyGenerator()
    )

    mockery.registerMock('deps-object', function (deps) {
      var obj = deps.reduce(function (o, v) {
        var tok = v.split('@')
        if (tok.length === 1) tok.push('*')
        o[tok[0]] = tok[1]
        return o
      }, {})
      return Promise.resolve(obj)
    })
  })

  after(function () {
    mockery.disable()
  })
}

