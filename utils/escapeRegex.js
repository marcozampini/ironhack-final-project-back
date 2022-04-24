
/**
 *  Adds a '\' to escape any special character
 * @param string input
 * @returns string
 */
const escapeRegex = function (input) {
  return input ? input.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') : input
}

module.exports = escapeRegex
