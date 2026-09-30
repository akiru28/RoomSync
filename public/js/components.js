/* components.js — marker-based component loader
   Injects header/footer/modals at HTML comment markers.
   Sets nav active states, sidebar toggle, and auth-aware header links. */

(function(){
  const COMMENT_MARKERS = {
    header: 'header injected',
    sidebar: 'sidebar injected',
    footer: 'footer injected',
    modals: 'modals injected'
  };

  async function loadHtml(url){
    try{
      const res = await fetch(url);
      if(!res.ok) throw new Error('HTTP ' + res.status);
      return await res.text();
    }catch(e){
      console.warn('[components] Failed to load', url, e);
      return null;
    }
  }

  function findMarker(root, markerText){
    const tw = document.createTreeWalker(root, NodeFilter.SHOW_COMMENT);
    let n;
    while((n = tw.nextNode())){
      if(n.nodeValue && n.nodeValue.trim() === markerText) return n;
    }
    return null;
  }

  function injectAtMarker(root, markerText, html){
    if(!html) return false;
    const marker = findMarker(root, markerText);
    if(!marker){
      console.debug('[components] Marker not found:', markerText);
      return false;
    }
    const tpl = document.createElement('template');
    tpl.innerHTML = html.trim();
    const frag = tpl.content;
    marker.parentNode.replaceChild(frag, marker);
    return true;
  }

  function setActiveNavLinks(){
    const current = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    document.querySelectorAll('.topnav a, .sidebar a, .landing-nav a').forEach(a=>{
      if(a.classList.contains('btn') || a.hasAttribute('data-logout') || a.classList.contains('nav-user-pill')) return;
      const href = a.getAttribute('href');
      if(!href || href.startsWith('#')) return;
      const page = href.split('/').pop().split('#')[0].split('?')[0].toLowerCase();
      if(page === current){
        a.classList.add('active');
        a.setAttribute('aria-current', 'page');
      }
    });
  }

  function setupSidebarToggle(){
    const headerInner = document.querySelector('.header-inner');
    const sidebar = document.getElementById('sidebar');
    if(!sidebar || !headerInner) return;
    if(document.querySelector('.nav-toggle')) return;

    let backdrop = document.querySelector('.sidebar-backdrop');
    if(!backdrop){
      backdrop = document.createElement('div');
      backdrop.className = 'sidebar-backdrop';
      backdrop.setAttribute('aria-hidden', 'true');
      document.body.appendChild(backdrop);
    }

    const toggle = document.createElement('button');
    toggle.className = 'nav-toggle';
    toggle.type = 'button';
    toggle.setAttribute('aria-label','Toggle navigation');
    toggle.setAttribute('aria-controls','sidebar');
    toggle.setAttribute('aria-expanded','false');
    toggle.innerHTML = '☰';

    function setOpen(open){
      sidebar.classList.toggle('open', open);
      backdrop.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', String(open));
      document.body.style.overflow = open ? 'hidden' : '';
    }

    toggle.addEventListener('click', (e)=>{
      e.stopPropagation();
      const open = sidebar.classList.contains('open');
      setOpen(!open);
    });

    backdrop.addEventListener('click', ()=> setOpen(false));

    sidebar.querySelectorAll('a').forEach(a=>{
      a.addEventListener('click', ()=> setOpen(false));
    });

    document.addEventListener('keydown', e=>{
      if(e.key === 'Escape' && sidebar.classList.contains('open')){
        setOpen(false);
      }
    });

    headerInner.insertBefore(toggle, headerInner.firstChild);
  }

  function applyAuthToHeader(){
    if (window.Auth) window.Auth.renderNavigation();
  }

  document.addEventListener('DOMContentLoaded', async ()=>{
    const root = document.getElementById('app') || document.body;
    const base = '../components/';

    const [headerHtml, sidebarHtml, footerHtml, modalHtml] = await Promise.all([
      loadHtml(base + 'header.html'),
      loadHtml(base + 'sidebar.html'),
      loadHtml(base + 'footer.html'),
      loadHtml(base + 'modals/reserve-modal.html')
    ]);

    injectAtMarker(root, COMMENT_MARKERS.header, headerHtml);
    injectAtMarker(root, COMMENT_MARKERS.sidebar, sidebarHtml);
    injectAtMarker(root, COMMENT_MARKERS.footer, footerHtml);
    injectAtMarker(root, COMMENT_MARKERS.modals, modalHtml);

    setActiveNavLinks();
    setupSidebarToggle();
    applyAuthToHeader();
    document.dispatchEvent(new CustomEvent('roomsync:components-ready'));
  });

  /* Global modal helpers (exposed for inline handlers) */
  function openModal(id){
    const m = document.getElementById(id);
    if(!m) return;
    m.setAttribute('aria-hidden','false');
    document.body.style.overflow = 'hidden';
  }
  function closeModal(id){
    const m = document.getElementById(id);
    if(!m) return;
    m.setAttribute('aria-hidden','true');
    document.body.style.overflow = '';
  }

  document.addEventListener('keydown', e=>{
    if(e.key !== 'Escape') return;
    document.querySelectorAll('.modal[aria-hidden="false"]').forEach(m=>{
      closeModal(m.id);
    });
  });

  document.addEventListener('click', e=>{
    if(e.target.matches('[data-dismiss]')){
      const id = e.target.getAttribute('data-dismiss');
      closeModal(id);
    }
    if(e.target.classList && e.target.classList.contains('modal')){
      const panel = e.target.querySelector('.modal-panel');
      if(panel && !panel.contains(e.target)) closeModal(e.target.id);
    }
  });

  window.openModal = openModal;
  window.closeModal = closeModal;

  window.openReserveModal = id => {
    openModal('reserve-modal');
    const sel = document.querySelector('#modal-reserve-form select[name="room_id"]');
    if(sel && id) sel.value = String(id);
  };
})();
