// lib queryTools.js

/**
 * database Query Tool, select by owner's id
 * @param {Object} req browser request
 */
function getOwnerId(req) {
  return { id: req.params.id, UserId: req.user.id }
}

// export
// ==============================

module.exports = getOwnerId