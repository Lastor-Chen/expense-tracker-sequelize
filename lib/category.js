// lib categoryList.js

// record category to font-awesome icon map
// ==============================

/**
 * category 對照 font-awesome CSS 名稱
 * @type {Object} 名稱對照表
 * @property {String} 類別名稱 
*/
const categoryMap = {
  '家居物業': 'fa-home',
  '交通出行': 'fa-shuttle-van',
  '休閒娛樂': 'fa-grin-beam',
  '餐飲食品': 'fa-utensils',
  '其他': 'fa-pen'
}


// tools
// ==============================

/**
 * 依據 category 屬性值，回傳 font-awesome icon 名稱
 * @param {Object} record sequelize single instance
 */
function getCategoryIcon(record) {
  for (const key in categoryMap) {
    if (record.category === key) return categoryMap[key]
  }
}

/**
 * 依 categoryMap 生成 select list 參照陣列，標記 selected
 * @param {*} [record] sequelize single instance
 * @returns {Array} [{ category: "String", selected: Boolean }...]
 */
function getSelectList(record = {}) {
  const select = []

  Object.keys(categoryMap).forEach(name => {
    const obj = { category: name }

    if (name === record.category) { obj.selected = true }
    select.push(obj)
  })

  return select
}


// export
// ==============================

module.exports = { categoryMap, getCategoryIcon, getSelectList }