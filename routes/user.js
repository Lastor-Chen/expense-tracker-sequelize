// routes user.js

// import package
// ==============================

const express = require('express')
const router = express.Router()
const passport = require('passport')
const bcrypt = require('bcryptjs')

// sequelize model
const db = require('../models')
const User = db.User

// custom module
const { checkSignUp, checkProfile, checkPassword } = require('../lib/checkForm.js')
const isAuthed = require('../config/auth.js')

// routes '/users'
// ==============================

// 登入
router.get('/signin', (req, res) => {
  const email = req.flash('email')

  res.render('signin', { css: 'sign', js: 'sign', signin: 'signin' , email })
})

router.post('/signin', (req, res, next) => {
  // 登入失敗時，保留 input email
  req.flash('email', req.body.email)

  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/signin',
    failureFlash: true,
    badRequestMessage: '您沒有輸入帳號或密碼'
  })(req, res, next)
})

// 註冊
router.get('/signup', (req, res) => {
  res.render('signup', { css: 'sign', js: 'sign'})
})

router.post('/signup', async (req, res, next) => {
  const input = { ...req.body }

  // 檢查表單
  let error = await checkSignUp(input)
  if (error.length) return res.render('signup', { input, error, css: 'sign' })

  // 註冊帳號
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(input.password, salt);
  input.password = hash

  try { await User.create(input) }
  catch (err) { res.status(422).json(err) }
  
  // 資料庫儲存後，直接發 session 憑證登入
  passport.authenticate('local', {
    successRedirect: '/index',
    failureRedirect: '/users/signin',
  })(req, res, next)
})

// 登出
router.get('/signout', (req, res) => {
  req.logout()
  req.flash('success', '您已成功登出')

  res.redirect('/users/signin')
})

// user profile
router.get('/setting', isAuthed, (req, res) => {
  const user = req.user
  res.render('setting', { user })
})

router.put('/setting/profile', isAuthed, async (req, res) => {
  const input = req.body
  const operator = req.user
  const form = req.query.form

  // 檢查表單
  const error = await checkProfile(input, operator)
  if (error.length) return res.render('setting', { input, form, error })

  User.update({ ...input }, { where: { id: operator.id } })
    .then(user => res.redirect('/index'))
    .catch(err => res.status(422).json(err))
})

router.put('/setting/password', isAuthed, (req, res) => {
  const { password } = req.body
  const user = req.user
  const form = req.query.form

  // 檢查表單
  const error = checkPassword(req.body)
  if (error.length) return res.render('setting', { user, form, error })

  const hash = bcrypt.hashSync(password, 10)
  User.update({ password: hash }, { where: { id: user.id } })
    .then(user => res.redirect('/index') )
    .catch(err => res.status(422).json(err) )
})


// export
// ==============================

module.exports = router