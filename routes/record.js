// routes record.js

// import package
// ==============================

const express = require('express')
const router = express.Router()

// sequelize model
const db = require('../models')
const Record = db.Record

// custom module
const { getSelectList } = require('../lib/category.js')
const { getOwnerId, checkNewEdit } = require('../lib/lib.js')


// routes '/records'
// ==============================

// Create
router.get('/new', (req, res) => {
  // 上一筆輸入 ( flash 回傳為陣列，需往內指 )
  const input = req.flash('input')[0]

  // HTML select list 參照表，依 input 標記 selected
  const select = getSelectList(input)

  res.render('newEdit', { js: 'newEdit', new: 'new', select, input })
})

router.post('/new', (req, res) => {
  const input = { ...req.body }

  // 檢查表單
  let error = checkNewEdit(input)
  if (error.length) {
    req.flash('error', error)
    req.flash('input', input)
    return res.redirect('/records/new')
  }

  // 儲存至 database
  input.UserId = req.user.id

  Record.create(input)
    .then(record => res.redirect('/index') )
    .catch(err => res.status(422).json(err) )
})

// Update
router.get('/:id/edit', (req, res) => {
  const id = req.params.id

  // 取得上一筆 user input
  const input = req.flash('input')[0]

  Record.findOne({ where: getOwnerId(req) })
    .then(record => {
      // 非擁有者時，導回首頁
      if (!record) return res.redirect('/index')

      // format date { yyyy-mm-dd }
      record.showDate = record.date.toISOString().slice(0, 10)

      // HTML select list 參照表，依 record 標記 selected
      const select = getSelectList(record)

      res.render('newEdit', { js: 'newEdit', id, record, select, input })
    })
    .catch(err => res.status(422).json(err))
})

router.put('/:id/edit', (req, res) => {
  const input = req.body
  const id = req.params.id

  // 檢查表單
  let error = checkNewEdit(input)
  if (error.length) {
    req.flash('error', error)
    req.flash('input', input)
    return res.redirect(`/records/${id}/edit`)
  }

  // 儲存至 database
  Record.findOne({ where: getOwnerId(req) })
    .then(record => {
      // 非擁有者時，導回首頁
      if (!record) return res.redirect('/index')

      // 將 user input 回存
      for (const key in input) {
        record[key] = input[key]
      }

      record.save()
        .then(record => res.redirect('/index'))
        .catch(err => res.status(422).json(err))
    })
    .catch(err => res.status(422).json(err))
})

// Delete
router.delete('/:id/delete', (req, res) => {
  Record.findOne({ where: getOwnerId(req) })
    .then(record => {
      // 非擁有者時，導回首頁
      if (!record) return res.redirect('/index')

      record.destroy()
        .then(record => res.redirect('/index'))
        .catch(err => res.status(422).json(err))
    })
    .catch(err => res.status(422).json(err))
})

// export
// ==============================

module.exports = router