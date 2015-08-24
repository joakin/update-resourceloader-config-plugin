module.exports = function objMap (obj, fn) {
  return Object.keys(obj).reduce(function (acc, k) {
    acc[k] = fn(obj[k], k, obj)
    return acc
  }, {})
}
