const escapeRegex = function (input) {
  if (input) {
    return input.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
  }
}

module.exports = escapeRegex
