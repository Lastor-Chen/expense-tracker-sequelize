// new and edit 頁面附屬 js

// =================================

// 限制 input date 最大值為 today
const today = new Date()
const formate = today.toJSON().split('T')[0]

$('[type="date"]').prop('max', formate)