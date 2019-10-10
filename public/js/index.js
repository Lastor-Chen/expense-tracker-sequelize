// index 頁面附屬 js

import { showSelected, setOddEven, getTotalAmount } from './lib/lib.js'
import { chartPie } from './config/chartPie.js'

// 執行序
// =================================

// 計算總金額，顯示於頁面
$('#sum').html(getTotalAmount())

// 繪製圓餅圖
chartPie()

// 刪除確認，僅監聽父層避免產生過多 listener
$('.data-plane').submit(e => {
  e.preventDefault()

  if (e.target.matches('.del-form')) {
    const msg = '這個操作無法被復原，確定要刪除嗎?'
    if (confirm(msg)) { e.target.submit() }
  }
})


// category filter
$('#filter').on('input', e => {
  const keyword = e.target.value

  // 只顯示被選中的 category
  showSelected(keyword)

  // 重設 visible record 之 classList
  setOddEven()

  // 計算總金額，顯示於頁面
  const totalAmount = getTotalAmount()
  $('#sum').html(totalAmount)
})


// month filter
$('#month').on('input', e => {
  $('#month').submit()
})