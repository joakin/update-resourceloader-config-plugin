var objMap = require('./obj-map')
var uniq = require('./uniq')
var getEntry = require('./get-entry')

module.exports = ExtractMFRequiredModules

function ExtractMFRequiredModules (opts) {
  opts = opts || {}
  this.functionName = 'mw.mobileFrontend.require'
  this.aliases = opts.aliases || {}
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
    self.modules[entry].push(
      parseModuleName(self.aliases, expr.arguments[0].value)
    )
    return true
  })
}

function parseModuleName (aliases, name) {
  if (aliases[name]) return aliases[name]
  var hasSlash = name.indexOf('/') !== -1
  if (hasSlash) return name.split('/')[0]
  return name
}
