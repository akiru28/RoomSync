/* rooms.js — API-backed room catalogue */
document.addEventListener('DOMContentLoaded', async () => {
  if (!(await Auth.requireAuth())) return; const list = document.getElementById('rooms-list'); if (!list) return; list.innerHTML = '<div class="empty" style="padding:var(--space-6)"><div class="empty-icon">🗂️</div><h3>Loading rooms</h3><p>Fetching the latest inventory from the server.</p></div>';
  try { const allRooms = await Api.get('/rooms'); const rooms = location.pathname.endsWith('labs.html') ? allRooms.filter(r => r.type === 'lab') : allRooms;
    const canReserve = Auth.canReserve();
    const statCount = (sel, label, val) => { const el = document.querySelector(sel); if (el) el.innerHTML = `<small>${label}</small><div class="stat-num">${val}</div>`; };
    if (document.getElementById('stat-rooms')) statCount('#stat-rooms .stat-num', 'Rooms', '') || (document.getElementById('stat-rooms').innerHTML = `<small>Available</small><div class="stat-num">${rooms.filter(r => r.isActive !== false).length}</div>`);
    const render = (items) => {
      if (!items.length) {
        list.innerHTML = `<div class="empty"><div class="empty-icon">🔎</div><h3>No matching rooms found</h3><p>Try adjusting your filters or search terms to see more results.</p></div>`;
        return;
      }
      list.innerHTML = items.map(r => {
        const typeClass = r.type === 'lab' ? 'room-type lab' : 'room-type';
        const typeLabel = (r.type || 'Room').trim();
        const features = (r.features || []).filter(Boolean);
        const chipRow = features.length ? `<div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:var(--space-2)">${features.slice(0, 6).map(f => `<span style="font-size:11px;padding:3px 8px;border-radius:999px;background:var(--surface-2);border:1px solid var(--border);color:var(--text-2);font-weight:600;letter-spacing:.01em">${f}</span>`).join('')}</div>` : `<div class="muted" style="margin-top:var(--space-2);font-size:var(--fs-sm)">No equipment listed.</div>`;
        const actions = canReserve
          ? `<div class="card-actions"><a class="btn primary small" href="reservation.html?roomId=${encodeURIComponent(r.id ?? '')}&room=${encodeURIComponent(r.name ?? '')}">Reserve</a></div>`
          : `<div class="card-actions"><span class="badge info small" style="cursor:help" title="Only an Instructor can reserve this room">View-only</span></div>`;
        return `<article class="card room-card">
          <div class="card-head">
            <h3>${r.name}</h3>
            <span class="${typeClass}">${typeLabel}</span>
          </div>
          <p class="muted">${r.location || 'CSPC Campus'}</p>
          <div class="card-stats">
            <div class="mini"><small>Capacity</small><span>${r.capacity ?? '—'}</span></div>
            <div class="mini"><small>Status</small><span style="color:${r.isActive === false ? 'var(--danger)' : 'var(--success)'}">${r.isActive === false ? 'Closed' : 'Open'}</span></div>
          </div>
          ${chipRow}
          ${actions}
        </article>`;
      }).join('');
    };
    render(rooms); const search = document.getElementById('room-search'), capacity = document.getElementById('capacity-filter'); const filter = () => render(rooms.filter(r => (!search.value || `${r.name} ${r.location || ''} ${(r.features || []).join(' ')}`.toLowerCase().includes(search.value.toLowerCase())) && (!capacity.value || (capacity.value === '31+' ? r.capacity >= 31 : capacity.value === '1-10' ? r.capacity <= 10 : r.capacity >= 11 && r.capacity <= 30)))); search?.addEventListener('input', filter); capacity?.addEventListener('change', filter);
  } catch (err) { list.innerHTML = `<div class="empty"><div class="empty-icon">⚠️</div><h3>Unable to load rooms</h3><p>${err.message}</p></div>`; }
});
