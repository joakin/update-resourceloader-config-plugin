module.exports = function uniq (arr) {
  return arr.filter(function (x, i) { return arr.indexOf(x) === i })
}

