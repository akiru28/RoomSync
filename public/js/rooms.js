/* rooms.js — API-backed room catalogue */
document.addEventListener('DOMContentLoaded', async () => {
  if (!(await Auth.requireAuth())) return; const list = document.getElementById('rooms-list'); if (!list) return;
  const makeEmpty = (iconName, title, message, style) => {
    const empty = document.createElement('div'); empty.className = 'empty'; if (style) empty.style.cssText = style;
    const iconEl = document.createElement('div'); iconEl.className = 'empty-icon'; iconEl.appendChild(window.RoomSyncIcons.create(iconName));
    const heading = document.createElement('h3'); heading.textContent = title;
    const paragraph = document.createElement('p'); paragraph.textContent = message;
    empty.append(iconEl, heading, paragraph); return empty;
  };
  list.replaceChildren(makeEmpty('folder', 'Loading rooms', 'Fetching the latest inventory from the server.', 'padding:var(--space-6)'));
  try { const allRooms = await Api.get('/rooms'); const rooms = location.pathname.endsWith('labs.html') ? allRooms.filter(r => r.type === 'lab') : allRooms;
    const equipmentResults = await Promise.allSettled(rooms.map(room => room.id == null ? Promise.reject(new Error('Room ID unavailable')) : Api.get(`/rooms/${encodeURIComponent(room.id)}/equipment`)));
    const equipmentByRoom = new Map(rooms.map((room, index) => [String(room.id), equipmentResults[index].status === 'fulfilled' ? equipmentResults[index].value : null]));
    const canReserve = Auth.canReserve();
    if (document.getElementById('stat-rooms')) {
      const stat = document.getElementById('stat-rooms');
      const label = document.createElement('small'); label.textContent = 'Available';
      const count = document.createElement('div'); count.className = 'stat-num'; count.textContent = String(rooms.filter(r => r.isActive !== false).length);
      stat.replaceChildren(label, count);
    }
    const render = (items) => {
      if (!items.length) {
        list.replaceChildren(makeEmpty('search', 'No matching rooms found', 'Try adjusting your filters or search terms to see more results.'));
        return;
      }
      const cards = items.map(r => {
        const card = document.createElement('article'); card.className = 'card room-card';
        const head = document.createElement('div'); head.className = 'card-head';
        const name = document.createElement('h3'); name.textContent = r.name ?? '';
        const type = document.createElement('span'); type.className = r.type === 'lab' ? 'room-type lab' : 'room-type'; type.textContent = (r.type || 'Room').trim();
        head.append(name, type);
        const location = document.createElement('p'); location.className = 'muted'; location.textContent = r.location || 'CSPC Campus';
        const stats = document.createElement('div'); stats.className = 'card-stats';
        const capacity = document.createElement('div'); capacity.className = 'mini';
        const capacityLabel = document.createElement('small'); capacityLabel.textContent = 'Capacity';
        const capacityValue = document.createElement('span'); capacityValue.textContent = String(r.capacity ?? '—');
        capacity.append(capacityLabel, capacityValue);
        const status = document.createElement('div'); status.className = 'mini';
        const statusLabel = document.createElement('small'); statusLabel.textContent = 'Status';
        const statusValue = document.createElement('span'); statusValue.style.color = r.isActive === false ? 'var(--danger)' : 'var(--success)'; statusValue.textContent = r.isActive === false ? 'Closed' : 'Open';
        status.append(statusLabel, statusValue); stats.append(capacity, status);
        const features = (r.features || []).filter(Boolean);
        const content = [head, location, stats];
        if (features.length) {
          const chipRow = document.createElement('div'); chipRow.style.cssText = 'display:flex;gap:6px;flex-wrap:wrap;margin-top:var(--space-2)';
          features.slice(0, 6).forEach(feature => {
            const chip = document.createElement('span'); chip.style.cssText = 'font-size:11px;padding:3px 8px;border-radius:999px;background:var(--surface-2);border:1px solid var(--border);color:var(--text-2);font-weight:600;letter-spacing:.01em'; chip.textContent = feature; chipRow.append(chip);
          });
          content.push(chipRow);
        }
        const equipment = equipmentByRoom.get(String(r.id));
        const equipmentSection = document.createElement('div'); equipmentSection.style.cssText = 'margin-top:var(--space-2);font-size:var(--fs-sm)';
        const equipmentHeading = document.createElement('small'); equipmentHeading.textContent = 'Equipment'; equipmentSection.append(equipmentHeading);
        if (equipment === null) {
          const unavailable = document.createElement('div'); unavailable.className = 'muted'; unavailable.textContent = 'Unable to load equipment.'; equipmentSection.append(unavailable);
        } else if (!equipment?.length) {
          const none = document.createElement('div'); none.className = 'muted'; none.textContent = 'No equipment listed.'; equipmentSection.append(none);
        } else {
          const equipmentList = document.createElement('div'); equipmentList.style.cssText = 'display:flex;flex-direction:column;gap:4px;margin-top:4px';
          equipment.forEach(item => {
            const row = document.createElement('div'); row.style.cssText = 'display:flex;justify-content:space-between;align-items:center;gap:8px';
            const itemName = document.createElement('span'); itemName.textContent = item.name ?? '';
            const itemStatus = document.createElement('span'); itemStatus.className = 'badge small';
            if (typeof item.status === 'string' && /^[a-z-]+$/.test(item.status)) itemStatus.classList.add(item.status);
            itemStatus.textContent = item.status ?? 'Unknown'; row.append(itemName, itemStatus); equipmentList.append(row);
          });
          equipmentSection.append(equipmentList);
        }
        content.push(equipmentSection); card.append(...content);
        const actions = document.createElement('div'); actions.className = 'card-actions';
        if (canReserve) {
          const reserve = document.createElement('a'); reserve.className = 'btn primary small';
          reserve.href = `reservation.html?roomId=${encodeURIComponent(r.id ?? '')}&room=${encodeURIComponent(r.name ?? '')}`; reserve.textContent = 'Reserve'; actions.append(reserve);
        } else {
          const badge = document.createElement('span'); badge.className = 'badge info small'; badge.style.cursor = 'help'; badge.title = 'Only an Instructor can reserve this room'; badge.textContent = 'View-only'; actions.append(badge);
        }
        card.append(actions); return card;
      });
      list.replaceChildren(...cards);
    };
    render(rooms); const search = document.getElementById('room-search'), capacity = document.getElementById('capacity-filter'); const filter = () => render(rooms.filter(r => (!search.value || `${r.name} ${r.location || ''} ${(r.features || []).join(' ')}`.toLowerCase().includes(search.value.toLowerCase())) && (!capacity.value || (capacity.value === '31+' ? r.capacity >= 31 : capacity.value === '1-10' ? r.capacity <= 10 : r.capacity >= 11 && r.capacity <= 30)))); search?.addEventListener('input', filter); capacity?.addEventListener('change', filter);
  } catch (err) { list.replaceChildren(makeEmpty('alert', 'Unable to load rooms', err.message)); }
});
