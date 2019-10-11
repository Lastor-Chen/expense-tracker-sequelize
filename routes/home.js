// routes home.js

// import package
// ==============================

const express = require('express')
const router = express.Router()
const sequelize = require('sequelize')

// sequelize model
const db = require('../models')
const Record = db.Record

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

router.get('/index', async (req, res) => {
  // 處理月份 filter
  const month = +req.query.month
  const query = { userId: req.user.id }
  if (month) { query['$and'] = sequelize.where(sequelize.fn('MONTH', sequelize.col('date')), month) }

  let records = []
  try { records = await Record.findAll({ where: query, order: [['date', 'DESC']] }) }
  catch (err) { res.status(422).json(err) }

  // 處理頁面所需資訊，注入 record
  let times = 1
  for (const record of records) {
    record.iconName = getCategoryIcon(record)

    // format Date { yyyy-mm-dd }
    record.showDate = record.date.toISOString().slice(0, 10)

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


// export
// ==============================

module.exports = router