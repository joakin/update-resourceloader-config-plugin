var path = require('path')

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

function uniq (arr) { return arr.filter(function (x, i) { return arr.indexOf(x) === i }) }

function objMap (obj, fn) {
  return Object.keys(obj).reduce(function (acc, k) {
    acc[k] = fn(obj[k], k, obj)
    return acc
  }, {})
}
