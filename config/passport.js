// config passport.js

// import package
// ==============================

const LocalStrategy = require('passport-local').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const User = require('../models/user.js')
const bcrypt = require('bcryptjs')


// Local Strategy
// ==============================

const localOption = {
  usernameField: 'email'
}

function localCallback(email, password, done) {
  User.findOne({ email }, (err, user) => {
    if (err) return console.error(err)

    // 檢查 email 帳號
    if (!user) return done(null, false, { message: '查無此帳號，請重新輸入' })

    // 檢查加鹽後的密碼
    bcrypt.compare(password, user.password, (err, success) => {
      if (err) return console.error(err)

      if (!success) return done(null, false, { message: '密碼不符，請重新輸入' })

      done(null, user)
    })
  })
}


// 設定 Facebook Strategy
// ==============================

const fbOption = {
  clientID: process.env.FACEBOOK_ID,
  clientSecret: process.env.FACEBOOK_SECRET,
  callbackURL: process.env.FACEBOOK_CALLBACK,
  profileFields: ['email', 'displayName']
}

function fbCallback(accessToken, refreshToken, profile, cb) {
  User.findOne({ email: profile._json.email }, (err, user) => {
    if (err) return console.error(err)

    // 如帳戶已存在，回傳 user
    if (user) return cb(err, user)

    // 如帳戶未存在，註冊新帳戶
    const userInfo = { ...profile._json }
    delete userInfo.id

    // 亂數給予一組密碼，並加鹽
    userInfo.password = Math.random().toString(36).slice(-8)
    bcrypt.hash(userInfo.password, 10, (err, hash) => {
      if (err) return console.error(err)

      userInfo.password = hash
      User.create(userInfo, (err, user) => cb(err, user))
    })
  });
}


// Strategy 主函式
// ==============================

function strategy(passport) {
  // 設定 Strategy
  passport.use(new LocalStrategy(localOption, localCallback))
  passport.use(new FacebookStrategy(fbOption, fbCallback))

  // 序列化 session
  passport.serializeUser((user, done) => done(null, user.id))

  // 反序列化 session
  passport.deserializeUser((id, done) => {
    User.findById(id, function (err, user) {
      done(err, user)
    })
  })
}


// Export
// ============================

module.exports = strategy