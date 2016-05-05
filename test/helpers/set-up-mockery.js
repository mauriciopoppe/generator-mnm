var mockery = require('mockery')
var helpers = require('yeoman-generator').test

module.exports = function (before, after) {
  before(function () {
    mockery.enable({warnOnUnregistered: false})

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
  })

  after(function () {
    mockery.disable()
  })
}
