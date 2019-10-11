// config passport.js

// import package
// ==============================

const LocalStrategy = require('passport-local').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const bcrypt = require('bcryptjs')

// sequelize model
const db = require('../models')
const User = db.User

// Local Strategy
// ==============================

const localOption = {
  usernameField: 'email'
}

async function localCallback(email, password, done) {
  // 檢查 email 帳號
  let user = {}
  try { user = await User.findOne({ where: { email } }) }
  catch (err) { console.error(err) }

  if (!user) return done(null, false, { message: 'Email 或 Password 不符' })

  // 檢查加鹽後的密碼
  const success = bcrypt.compareSync(password, user.password)
  if (!success) return done(null, false, { message: 'Email 或 Password 不符' })

  done(null, user)
}


// 設定 Facebook Strategy
// ==============================

const fbOption = {
  clientID: process.env.FACEBOOK_ID,
  clientSecret: process.env.FACEBOOK_SECRET,
  callbackURL: process.env.FACEBOOK_CALLBACK,
  profileFields: ['email', 'displayName']
}

async function fbCallback(accessToken, refreshToken, profile, cb) {
  // 確認 Email 是否已註冊
  let user = {}
  try { user = await User.findOne({ where: { email: profile._json.email } }) }
  catch (err) { console.error(err) }
  
  if (user) return cb(null, user)

  // 註冊新帳戶
  const newUser = { ...profile._json }
  delete newUser.id

  // 亂數給予一組密碼，並加鹽
  newUser.password = Math.random().toString(36).slice(-8)

  const hash = bcrypt.hashSync(newUser.password, 10)
  newUser.password = hash

  User.create(newUser)
    .then(user => cb(null, user) )
    .catch(err => console.error(err) )
}


// Strategy 主函式
// ==============================

module.exports = passport =>  {
  // 設定 Strategy
  passport.use(new LocalStrategy(localOption, localCallback))
  passport.use(new FacebookStrategy(fbOption, fbCallback))

  // 序列化 session
  passport.serializeUser((user, done) => done(null, user.id))

  // 反序列化 session
  passport.deserializeUser((id, done) => {
    User.findByPk(id)
      .then(user => done(null, user))
  })
}