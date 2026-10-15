/* main.js — UI helpers, verified session state, and role-aware navigation */
(function () {
  'use strict';
  const TOKEN = 'rr_token', USER = 'rr_user';
  const THEME = 'rr_theme';
<<<<<<< HEAD
  const THEME_PAGES = new Set([
    'admin.html', 'calendar.html', 'dashboard.html', 'labs.html',
    'my-reservations.html', 'profile.html', 'reports.html',
    'reservation.html', 'rooms.html',
  ]);
  const currentPage = location.pathname.split('/').pop().toLowerCase();
  const themeEnabled = THEME_PAGES.has(currentPage);
  const CAN_RESERVE = ['instructor'];
  const CAN_APPROVE = ['admin'];
  let savedTheme = null;
  try { if (themeEnabled) savedTheme = localStorage.getItem(THEME); } catch (_) {}
  if (savedTheme === 'light' || savedTheme === 'dark') {
=======
  const THEME_ENABLED_PAGES = new Set([
    'admin.html',
    'calendar.html',
    'dashboard.html',
    'labs.html',
    'my-reservations.html',
    'profile.html',
    'reports.html',
    'reservation.html',
    'rooms.html',
  ]);
  const CAN_RESERVE = ['instructor'];
  const CAN_APPROVE = ['admin'];
  const currentPage = location.pathname.split('/').pop().toLowerCase();
  const themeEnabled = THEME_ENABLED_PAGES.has(currentPage);
  const savedTheme = localStorage.getItem(THEME);
  if (themeEnabled && (savedTheme === 'light' || savedTheme === 'dark')) {
>>>>>>> d727210a0516bfa64868a75374be255d532264a2
    document.documentElement.dataset.theme = savedTheme;
  }
  let currentUser = null, readyPromise = Promise.resolve(null);
  const qs = (s, c) => (c || document).querySelector(s);
  const qa = (s, c) => Array.from((c || document).querySelectorAll(s));
  const syncThemeToggle = () => {
    const dark = document.documentElement.dataset.theme === 'dark';
    const label = `Switch to ${dark ? 'light' : 'dark'} mode`;
    qa('[data-theme-toggle]').forEach((button) => {
      button.setAttribute('aria-label', label);
      button.title = label;
    });
  };
  syncThemeToggle();
  window.qs = qs; window.qa = qa;
  window.formatDateLocal = (v) => v ? new Date(v).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }) : '—';
  window.formatDateShort = (v) => v ? new Date(v).toLocaleDateString(undefined, { dateStyle: 'medium' }) : '—';
  window.formatTime = (v) => v ? new Date(v).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }) : '—';
  window.showToast = (type, title, message) => {
    let box = qs('.toast-container'); if (!box) { box = document.createElement('div'); box.className = 'toast-container'; document.body.appendChild(box); }
    const item = document.createElement('div'); item.className = `toast ${type || 'info'}`;
    item.innerHTML = '<div class="toast-body"><p class="toast-title"></p><p class="toast-msg"></p></div>';
    item.querySelector('.toast-title').textContent = title || ''; item.querySelector('.toast-msg').textContent = message || '';
    box.appendChild(item); setTimeout(() => item.remove(), 4500);
  };
  const hide = (el, yes) => {
    if (!el) return;
    el.hidden = !!yes;
    if (el.tagName === 'LI') el.toggleAttribute('hidden', !!yes);
    if (yes) el.style.setProperty('display', 'none', 'important');
    else el.style.removeProperty('display');
  };
  const Auth = {
    getToken: () => localStorage.getItem(TOKEN), getCurrentUser: () => currentUser, getCurrentRole: () => currentUser?.role || null,
    displayRole: (r) => ({ admin: 'Admin', instructor: 'Faculty', lab_tech: 'Lab Tech', student: 'Student' }[r] || 'User'),
    isAuthenticated: () => Boolean(currentUser && Auth.getToken()),
    isAdmin: () => Auth.getCurrentRole() === 'admin',
    isFaculty: () => Auth.getCurrentRole() === 'instructor',
    isLabTech: () => Auth.getCurrentRole() === 'lab_tech',
    isStudent: () => Auth.getCurrentRole() === 'student',
    canReserve: () => CAN_RESERVE.includes(Auth.getCurrentRole()),
    canApprove: () => CAN_APPROVE.includes(Auth.getCurrentRole()),
    ready: () => readyPromise,
    setSession(token, user) { localStorage.setItem(TOKEN, token); localStorage.setItem(USER, JSON.stringify(user)); currentUser = user; Auth.renderNavigation(); },
    clearSession(redirect) { localStorage.removeItem(TOKEN); localStorage.removeItem(USER); currentUser = null; if (redirect && !location.pathname.endsWith('login.html')) location.href = 'login.html'; },
    async initialize() { if (!Auth.getToken() || !window.Api) { Auth.renderNavigation(); return null; } try { currentUser = await window.Api.get('/auth/me'); localStorage.setItem(USER, JSON.stringify(currentUser)); } catch (_) { Auth.clearSession(false); } Auth.renderNavigation(); return currentUser; },
    async requireAuth() { await Auth.ready(); if (Auth.isAuthenticated()) return true; window.showToast('warning', 'Login required', 'Please sign in to continue.'); setTimeout(() => location.href = 'login.html', 300); return false; },
    async requireRole(...roles) { if (!(await Auth.requireAuth())) return false; if (roles.includes(Auth.getCurrentRole())) return true; window.showToast('error', 'Access denied', 'You do not have permission to view this page.'); setTimeout(() => location.href = 'dashboard.html', 300); return false; },
    async requireCanReserve() { return Auth.requireRole(...CAN_RESERVE); },
    async requireCanApprove() { return Auth.requireRole(...CAN_APPROVE); },
<<<<<<< HEAD
    async logout() { try { if (Auth.getToken()) await window.Api.post('/auth/logout', {}); } catch (_) {} Auth.clearSession(false); location.href = 'home.html'; },
=======
    async logout() { try { if (Auth.getToken()) await window.Api.post('/auth/logout', {}); } catch (_) {} Auth.clearSession(false); location.href = 'index.html'; },
>>>>>>> d727210a0516bfa64868a75374be255d532264a2
    renderNavigation() {
      const user = currentUser;
      const admin = Auth.isAdmin();
      const student = Auth.isStudent();
      const labTech = Auth.isLabTech();
      const reportAccess = labTech || admin;
      const canReserve = Auth.canReserve();

      qa('[data-admin-only]').forEach((el) => { hide(el, !admin); });
      qa('a[href="admin.html"]').forEach((el) => {
        hide(el.closest('li'), !admin);
        hide(el, !admin);
      });
      qa('[data-can-reserve]').forEach((el) => {
        const li = el.closest && el.closest('li');
        hide(el, !canReserve);
        if (li && li !== el) hide(li, !canReserve);
      });
      qa('a[href="reservation.html"]').forEach((el) => {
        hide(el, !canReserve);
        const li = el.closest && el.closest('li');
        if (li) hide(li, !canReserve);
      });
      qa('a[href="my-reservations.html"]').forEach((el) => {
        hide(el, !canReserve);
        const li = el.closest && el.closest('li');
        if (li) hide(li, !canReserve);
      });
      qa('[data-report-access]').forEach((el) => hide(el, !reportAccess));
      qa('[data-no-student]').forEach((el) => {
        hide(el, student);
        const li = el.closest && el.closest('li');
        if (li && li !== el) hide(li, student);
      });
      qa('[data-user-only]').forEach((el) => hide(el, !user));
      qa('[data-guest-only]').forEach((el) => hide(el, Boolean(user)));
      qa('[data-role-label]').forEach((el) => el.textContent = user ? Auth.displayRole(user.role) : '');
      qa('[data-user-name]').forEach((el) => el.textContent = user?.name || user?.email || 'User');
      qa('a.brand').forEach((el) => {
        el.setAttribute('href', user ? 'dashboard.html' : 'home.html');
      });
      qa('[data-logout]').forEach((el) => {
        el.onclick = (e) => {
          e.preventDefault();
          Auth.logout();
        };
      });
    }
  };
  window.Auth = Auth; readyPromise = Auth.initialize();
  document.addEventListener('roomsync:components-ready', Auth.renderNavigation);
  document.addEventListener('roomsync:components-ready', syncThemeToggle);
  document.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('click', (event) => {
      if (!event.target.closest('[data-theme-toggle]')) return;
      if (!themeEnabled) return;
      const theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
<<<<<<< HEAD
      const root = document.documentElement;
      // Suppress each component's independent CSS transition while the theme
      // tokens change, so the whole page switches together without stagger.
      root.classList.add('theme-switching');
      root.dataset.theme = theme;
      try { localStorage.setItem(THEME, theme); } catch (_) {}
      root.style.colorScheme = theme;
      root.style.backgroundColor = theme === 'dark' ? '#0B1220' : '#F8FAFC';
      const themeColor = qs('meta[name="theme-color"]');
      if (themeColor) themeColor.content = theme === 'dark' ? '#0B1220' : '#12355B';
      syncThemeToggle();
      requestAnimationFrame(() => requestAnimationFrame(() => root.classList.remove('theme-switching')));
    });
    const year = qs('#footer-year'); if (year) year.textContent = new Date().getFullYear();
=======
      document.documentElement.dataset.theme = theme;
      localStorage.setItem(THEME, theme);
      syncThemeToggle();
    });
    const year = qs('#footer-year'); if (year) year.textContent = new Date().getFullYear();
    qs('#refresh-btn')?.addEventListener('click', () => {
      const refreshEvent = new CustomEvent('roomsync:refresh', { cancelable: true });
      window.dispatchEvent(refreshEvent);
      if (!refreshEvent.defaultPrevented) location.reload();
    });

>>>>>>> d727210a0516bfa64868a75374be255d532264a2
    const header = qs('.site-header');
    const applyScroll = () => { if (header) header.classList.toggle('scrolled', window.scrollY > 8); };
    applyScroll(); window.addEventListener('scroll', applyScroll, { passive: true });

    const navToggle = qs('.nav-toggle');
    const sidebar = qs('#sidebar');
    if (navToggle && sidebar) {
      navToggle.addEventListener('click', (e) => {
        e.preventDefault();
        sidebar.classList.toggle('open');
        let bd = qs('.sidebar-backdrop');
        if (!bd) {
          bd = document.createElement('div');
          bd.className = 'sidebar-backdrop';
          document.body.appendChild(bd);
          bd.addEventListener('click', () => { sidebar.classList.remove('open'); bd.classList.remove('open'); });
        }
        bd.classList.toggle('open', sidebar.classList.contains('open'));
      });
    }

    qa('.page-header + section, .page-header + .card, .page-header ~ section, .page-header ~ .card, main.container > .grid-3, main.container > .card, main.container > .table-wrap, main.container > form.card, main.container > .calendar-wrap')
      .forEach((el, i) => el.classList.add('fade-up', `d${Math.min(8, (i % 8) + 1)}`));

    const path = location.pathname.split('/').pop() || 'dashboard.html';
    qa('.sidebar a[href], .topnav a[href]').forEach((a) => {
      const href = (a.getAttribute('href') || '').split('/').pop();
      if (!href || href.startsWith('#')) return;
      const matches = href === path || (path === '' && href === 'index.html');
      if (matches) { a.classList.add('active'); a.setAttribute('aria-current', 'page'); }
    });
  });
})();
