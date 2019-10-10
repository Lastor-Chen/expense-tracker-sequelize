// config auth.js

// custom middleware 檢查登入狀態
// ==============================

/**
 * 確認登入狀態後導向對應頁面
 * @param {*} req browser request
 * @param {*} res server response
 * @param {*} next next function
 */
function isAuthed(req, res, next) {
  // 以登入
  if (req.isAuthenticated()) return next()

  // 未登入
  res.redirect('/users/signin')
}


// export
// ==============================

module.exports = isAuthed