// routes user.js

// import package
// ==============================

const express = require('express')
const router = express.Router()
const passport = require('passport')

// custom module
const isAuthed = require('../config/auth.js')

// routes '/auth'
// ==============================

router.get('/facebook', passport.authenticate('facebook', {
  scope: ['email']
}))

router.get('/facebook/callback', passport.authenticate('facebook', {
  successRedirect: '/auth/valid',
  failureRedirect: '/users/signin'
}))

router.get('/valid', isAuthed, (req, res) => {
  // 不渲染 layout，輕量化
  res.render('valid', { js: 'valid', layout: false })
})

// export
// ============================

module.exports = router