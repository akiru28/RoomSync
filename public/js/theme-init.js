/* Apply the saved theme before stylesheets render to avoid a light-mode flash. */
(function () {
  'use strict';
  var rolePages = new Set([
    'admin.html', 'calendar.html', 'dashboard.html', 'labs.html',
    'my-reservations.html', 'profile.html', 'reports.html',
    'reservation.html', 'rooms.html',
  ]);
  var page = location.pathname.split('/').pop().toLowerCase();
  if (!rolePages.has(page)) return;
  try {
    var theme = localStorage.getItem('rr_theme');
    if (theme !== 'dark' && theme !== 'light') return;
    var root = document.documentElement;
    root.dataset.theme = theme;
    root.style.backgroundColor = theme === 'dark' ? '#0B1220' : '#F8FAFC';
    root.style.colorScheme = theme;
    var themeColor = document.querySelector('meta[name="theme-color"]');
    if (themeColor) themeColor.content = theme === 'dark' ? '#0B1220' : '#12355B';
  } catch (_) {
    // Storage may be unavailable; the stylesheet's light theme remains the fallback.
  }
})();
