var objMap = require('./obj-map')
var uniq = require('./uniq')
var getEntry = require('./get-entry')

module.exports = ExtractI18nKeys

function ExtractI18nKeys (opts) {
  opts = opts || {}
  this.functionName = opts.functionName || '__'
  this.messages = {}
  this.sendKeys = opts.onKeys || function () {}
}

ExtractI18nKeys.prototype.apply = function (compiler) {
  var self = this
  compiler.plugin('after-compile', function (compilation, cb) {
    self.messages = objMap(self.messages, function (v) { return uniq(v) })
    self.sendKeys(self.messages)
    cb()
  })
  compiler.parser.plugin('call ' + this.functionName, function (expr) {
    // var currentFile = path.relative('./', this.state.current.resource)
    var entry = getEntry(this.state.module)
    self.messages[entry] = self.messages[entry] || []
    self.messages[entry].push(expr.arguments[0].value)
    return true
  })
}
