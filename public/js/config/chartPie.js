// (前端) config/chartPie.js

import { countEachAmount } from '../lib/lib.js'

// Chart.js setting
// =================================

//資料標題
function chartPie() {
  const labels = ['家居物業', '交通出行', '休閒娛樂', '餐飲食品', '其他'];

  const count = countEachAmount(labels)

  const ctx = document.getElementById('canvasPie').getContext('2d');
  const pieChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: labels,
      datasets: [{
        //預設資料
        data: count,
        backgroundColor: ["#00A1FF", "#FF0004", "#17a2b8", "#ffc107", "#ccc"],
      }]
    }
  })
}


// Chart.js setting
// =================================

export { chartPie }