// valid 頁面附屬 js

// 此窗口為 OAuth pop-up 導入時，關閉
if (window.name === 'OAuth') {
  // 父視窗重新導向
  window.opener.location.replace('/index')
  window.close()
}