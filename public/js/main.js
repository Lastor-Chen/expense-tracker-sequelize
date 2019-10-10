// main layout 附屬 js

// 控制 user profile 選單 show/hidden
$(window).on('click', e => {
  const target = e.target

  if (target.matches('.user-btn')) { return $('.profile').toggleClass('show') }
  if (!target.matches('[data-inside]')) { $('.profile').removeClass('show') }
})