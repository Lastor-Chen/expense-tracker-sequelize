// routes home.js

// import package
// ==============================

const express = require('express')
const router = express.Router()
const Recode = require('../models/record.js')

// custom module
const { getCategoryIcon, getSelectList } = require('../lib/category.js')
const { getMonthList } = require('../lib/lib.js')

// routes '/'
// ==============================

router.get('/', (req, res) => {
  // 將登入失敗的 flash 洗掉
  req.flash('email')

  res.redirect('/index')
})

router.get('/index', (req, res) => {
  // 被篩選的月份
  const month = +req.query.month

  // db query 條件，$where 類似 JS 的 .filter
  const query = { userId: req.user.id }
  if (month) { query["$where"] = `this.date.getMonth() === ${month - 1}` }

  // 日期 {最新順} 排列
  Recode.find(query).sort({ date: -1 }).exec((err, records) => {
    if (err) return console.error(err)

    let times = 1
    for (const record of records) {
      // 取得 font-awesome icon 名稱
      record.iconName = getCategoryIcon(record)

      // format Date { yyyy-mm-dd }
      record.showDate = record.date.toJSON().split('T')[0]

      // 加入奇數列 flag
      if (times % 2 === 1) { record.oddEven = 'odd' }

      times++
    }

    // HTML category select list 參照表
    const select = getSelectList()

    // 月份選單 [1..(system month)]
    const monthList = getMonthList()

    res.render('index', { css: 'index', js: 'index', select, records, monthList, month })
  })  
})


// export
// ==============================

module.exports = router