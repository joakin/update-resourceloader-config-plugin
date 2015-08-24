var path = require('path')
var objMap = require('./obj-map')
var uniq = require('./uniq')

module.exports = ExtractMFRequiredModules

function ExtractMFRequiredModules (opts) {
  opts = opts || {}
  this.functionName = 'mw.mobileFrontend.require'
  this.modules = {}
  this.sendModules = opts.onModules || function () {}
}

ExtractMFRequiredModules.prototype.apply = function (compiler) {
  var self = this
  compiler.plugin('after-compile', function (compilation, cb) {
    self.modules = objMap(self.modules, function (v) { return uniq(v) })
    self.sendModules(self.modules)
    cb()
  })
  compiler.parser.plugin('call ' + this.functionName, function (expr) {
    // var currentFile = path.relative('./', this.state.current.resource)
    var entry = getEntry(this.state.module)
    self.modules[entry] = self.modules[entry] || []
    self.modules[entry].push(expr.arguments[0].value)
    return true
  })
}

function getEntry (module) {
  if (!module.reasons || module.reasons.length === 0) {
    return path.relative('./', module.resource)
  } else if (module.reasons.length === 1) {
    return getEntry(module.reasons[0].module)
  } else {
    console.error(module)
    throw new Error('Multiple reasons')
  }
}
