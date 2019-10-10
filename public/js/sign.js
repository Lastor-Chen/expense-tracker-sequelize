// signin, signup 頁面附屬 js

// =================================

// 此窗口為 OAuth pop-up 導入時，關閉
if (window.name === 'OAuth') {
  window.close()
}

// FB OAuth 按鈕
$('#fb-btn').on('click', e => {
  e.preventDefault()

  // 設定 pop-up 視窗大小
  const width = screen.width * 0.3
  const height = screen.height * 0.6

  // 設定 pop-up 視窗位置
  const left = (screen.width / 2) - (width / 2)
  const top = (screen.height / 2) - (height / 1.7)

  // 給定 pop-up 名稱為 'OAuth' 作為檢查 flag
  window.open('/auth/facebook', 'OAuth', `width=${width}, height=${height}, left=${left}, top=${top}`)
})