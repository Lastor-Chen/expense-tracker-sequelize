// routes record.js

// import package
// ==============================

const express = require('express')
const router = express.Router()
const Record = require('../models/record.js')

// custom module
const { getSelectList } = require('../models/category.js')
const { getOwnerId, checkNewEdit } = require('../models/lib/lib.js')


// routes '/records'
// ==============================

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
  input.userId = req.user.id

  Record.create(input, err => {
    if (err) return console.error(err)
    res.redirect('/index')
  })
})

router.get('/:id/edit', (req, res) => {
  const id = req.params.id

  // 上一筆輸入 ( flash 回傳為陣列，需往內指 )
  const input = req.flash('input')[0]

  Record.findOne(getOwnerId(req), (err, record) => {
    if (err) return console.error(err)

    // 非擁有者時，導回首頁
    if (!record) return res.redirect('/index')

    // format date { yyyy-mm-dd }
    record.showDate = record.date.toJSON().split('T')[0]

    // HTML select list 參照表，依 record 標記 selected
    const select = getSelectList(record)
    
    res.render('newEdit', { js: 'newEdit', id, record, select, input })
  })
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
  Record.findOne(getOwnerId(req), (err, record) => {
    if (err) return console.error(err)

    // 非擁有者時，導回首頁
    if (!record) return res.redirect('/index')

    // 將 user input 回存
    for (const key in input) {
      record[key] = input[key]
    }

    record.save(err => {
      if (err) return console.error(err)
      res.redirect('/index')
    })
  })
})

router.delete('/:id/delete', (req, res) => {
  Record.findOne(getOwnerId(req), (err, record) => {
    if (err) return console.error(err)

    // 非擁有者時，導回首頁
    if (!record) return res.redirect('/index')

    record.remove(err => {
      if (err) return console.error(err)
      res.redirect('/index')
    })
  })
})

// export
// ==============================

module.exports = router