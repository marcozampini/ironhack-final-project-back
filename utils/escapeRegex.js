const escapeRegex = function (input) {
  return input ? input.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') : input
}

module.exports = escapeRegex
