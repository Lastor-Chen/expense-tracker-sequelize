// 前端頁面 JS lib

// tool function
// =================================

/**
 * 僅顯示被選擇的 category
 * @param {String} keyword category name
 */
function showSelected(keyword) {
  $('[data-cate]').each((index, elem) => {
    const category = elem.dataset.cate

    // elem.hidden 帶 false 將導致迭代中斷，故改用 jquery
    if (keyword === 'all') return $(elem).attr('hidden', false)

    if (category !== keyword) { elem.hidden = true }
    if (category === keyword) { elem.hidden = false }
  })
}

/**
 * visible record，重新分配 classList
 */
function setOddEven() {
  let times = 1
  $('[data-cate]:visible').each((index, elem) => {
    elem.classList.remove('odd')

    if (times % 2 === 1) { elem.classList.add('odd') }
    times++
  })
}

/**
 * 計算 visible record 總金額，顯示於頁面
 */
function getTotalAmount() {
  let sum = 0
  $('[data-cate]:visible .amount').each((index, elem) => {
    sum += (+elem.textContent)
  })

  return sum
}

/**
 * 計算頁面各各分類的總金額，輸出 Array
 * @param {*} cateList 分類清單
 */
function countEachAmount(cateList) {
  const countArray = []

  cateList.forEach(cate => {
    let sum = 0
    $(`[data-cate="${cate}"]:visible .amount`).each((index, elem) => {
      sum += (+elem.textContent)
    })
    countArray.push(sum)
  })

  return countArray
}

// export
// =================================

export { showSelected, setOddEven, getTotalAmount, countEachAmount }