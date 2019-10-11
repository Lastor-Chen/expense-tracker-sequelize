// lib monthList.js

/**
 * 生成月份選單，小於系統月份
 * @return {Array} [ Number ]
 */
function getMonthList() {
  const date = new Date()

  // .getMonth() 從 0 開始，需 +1
  const currentMonth = date.getMonth() + 1

  // 生成 Array(num - 1) 之數字陣列, ex. Array(3) => [0, 1, 2]
  const monthList = [...Array(currentMonth + 1).keys()].slice(1)

  return monthList
}

// export
// ==============================

module.exports = getMonthList