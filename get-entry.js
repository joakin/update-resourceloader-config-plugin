var path = require('path')

module.exports = function getEntry (module) {
  if (!module.reasons || module.reasons.length === 0) {
    var rel = path.relative('./', module.resource)
    return path.join(
      path.dirname(rel),
      path.basename(rel, '.js')
    )
  } else if (module.reasons.length === 1) {
    return getEntry(module.reasons[0].module)
  } else {
    console.error(module)
    throw new Error('Multiple reasons')
  }
}

