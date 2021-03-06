// lib checkForm.js

const db = require('../models')
const User = db.User
const { categoryMap } = require('./category.js')

/**
 * 檢查註冊表單，回傳 error message { Array }
 * @param {Object} input user input
 */
async function checkSignUp(input) {
  // 確認未填
  if (!input.email || !input.password) return ['Email 或 Password 不得為空']

  // 確認密碼二次輸入
  if (input.password !== input.password2) return ['密碼不一致']

  // 確認已註冊
  let user = {}
  try { user = await User.findOne({ where: { email: input.email } }) }
  catch (err) { console.error(err) }

  return user ? ['此 Email 已被註冊'] : []
}

/**
 * 檢查 record 表單，回傳 error message { Array }
 * @param {Object} input user input
 */
function checkNewEdit(input) {
  // merchant 以外為必填
  const inputKeys = Object.keys(input)
  if (inputKeys.some(key => !input[key] && key !== 'merchant')) return ['店家以外皆為必填']

  const msg = []

  // 檢查 date { yyyy-mm-dd }
  // 說明: https://medium.com/@esganzerla/simple-date-validation-with-javascript-caea0f71883c
  const date = new Date(input.date)   // 如不符合格式，+date 會回傳 NaN
  const day = +input.date.split('-')[2]   // 取 dd，轉 Number
  const isValidDate = (+date && date.getDate() === day)   // 後段用於排除不存在日期，如 2019-02-30
  if (!isValidDate) msg.push('日期不符合格式 yyyy-mm-dd 或不存在')

  // 檢查 category
  const cateList = Object.keys(categoryMap)
  if (!cateList.some(cate => cate === input.category)) msg.push('此分類不存在')

  // 檢查 amount
  if (Number.isNaN(+input.amount)) msg.push('金額必須為數字')

  return msg
}

/**
 * 檢查 profile 表單，回傳 error message { Array }
 * @param {Object} input user input
 * @param {Object} operator user data
 */
async function checkProfile(input, operator) {
  // 確認未填
  const msg = []
  if (!input.email) { msg.push('Email 不得為空') }

  // 確認 Email
  let user = {}
  try { user = await User.findOne({ where: { email: input.email } }) }
  catch (err) { console.error(err) }

  if (user && user.id !== operator.id) { msg.push('這個 Email 已被使用') }

  return msg
}

/**
 * 檢查 password 表單，回傳 error message { Array }
 * @param {*} input user input
 */
function checkPassword(input) {
  const { password, password2 } = input
  const msg = []

  if (!password) { msg.push('請輸入新密碼') }
  if (password !== password2) { msg.push('密碼不一致') }

  return msg
}

// export
// ==============================

module.exports = { checkSignUp, checkNewEdit, checkProfile, checkPassword }