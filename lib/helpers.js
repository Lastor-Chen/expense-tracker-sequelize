// lib helpers.js

// Handlebars helpers
// ==============================

// 如果 arg1 === arg2
function ifEqual(arg1, arg2, options) {
  return arg1 === arg2 ? options.fn(this) : options.inverse(this)
}


// export
// ==============================

module.exports = ifEqual