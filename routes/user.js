// routes user.js

// import package
// ==============================

const express = require('express')
const router = express.Router()
const passport = require('passport')
const User = require('../models/user.js')
const bcrypt = require('bcryptjs')

// custom module
const { checkSignUp, checkProfile, checkPassword } = require('../lib/lib.js')
const isAuthed = require('../config/auth.js')

// routes '/users'
// ==============================

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

  await User.create(input)

  // 資料庫儲存後，直接發 session 憑證登入
  passport.authenticate('local', {
    successRedirect: '/index',
    failureRedirect: '/users/signin',
  })(req, res, next)
})

router.get('/signout', (req, res) => {
  req.logout()
  req.flash('success', '您已成功登出')

  res.redirect('/users/signin')
})

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

  // 更新
  await User.updateOne({ _id: operator.id }, { ...input })

  res.redirect('/index')
})

router.put('/setting/password', isAuthed, (req, res) => {
  const { password } = req.body
  const user = req.user
  const form = req.query.form

  // 檢查表單
  const error = checkPassword(req.body)
  if (error.length) return res.render('setting', { user, form, error })

  // 加鹽後更新
  bcrypt.hash(password, 10, async (err, hash) => {
    await User.updateOne({ _id: user.id }, { password: hash })
    res.redirect('/index')
  })
})


// export
// ==============================

module.exports = router