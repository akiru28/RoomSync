/* Populate the public home page with the same active room inventory as the dashboard. */
(function () {
  'use strict';

  const byId = (id) => document.getElementById(id);
  const setText = (id, value) => {
    const element = byId(id);
    if (element) element.textContent = value;
  };
  const typeLabel = (type) => ({
    lab: 'Laboratory', lecture: 'Lecture room', seminar: 'Seminar room', hall: 'Hall',
  }[type] || 'Room');

  function showRoomList(rooms) {
    const list = byId('home-room-list');
    if (!list) return;
    list.replaceChildren();

    if (!rooms.length) {
      const row = document.createElement('div');
      row.className = 'row';
      row.textContent = 'No active rooms available';
      list.append(row);
      return;
    }

    rooms.slice(0, 3).forEach((room) => {
      const row = document.createElement('div');
      row.className = 'row';
      const name = document.createElement('span');
      name.textContent = room.name || room.code || typeLabel(room.type);
      const badge = document.createElement('span');
      badge.className = 'badge approved';
      badge.textContent = 'Active';
      row.append(name, badge);
      list.append(row);
    });

    if (rooms.length > 3) {
      const row = document.createElement('div');
      row.className = 'row';
      row.textContent = `+ ${rooms.length - 3} more active rooms`;
      list.append(row);
    }
  }

  async function loadHomeInventory() {
    try {
      const response = await fetch('/api/rooms', { headers: { Accept: 'application/json' } });
      const payload = await response.json();
      if (!response.ok || !payload?.ok || !Array.isArray(payload.data)) {
        throw new Error(payload?.message || 'Room inventory is unavailable.');
      }

      // The public rooms endpoint returns active rooms, matching the dashboard's active-room totals.
      const rooms = payload.data.filter((room) => room.isActive !== false && room.isActive !== 0);
      const counts = rooms.reduce((result, room) => {
        result[room.type] = (result[room.type] || 0) + 1;
        const capacity = Number(room.capacity);
        if (Number.isFinite(capacity) && capacity > 0) result.capacity += capacity;
        return result;
      }, { capacity: 0 });
      const total = rooms.length;
      const labCount = counts.lab || 0;
      const lectureCount = counts.lecture || 0;
      const percent = (count) => total ? Math.round((count / total) * 100) : 0;

      showRoomList(rooms);
      setText('home-lab-count', String(labCount));
      setText('home-lecture-count', String(lectureCount));
      setText('home-total-capacity', counts.capacity.toLocaleString());
      setText('home-average-capacity', total ? String(Math.round(counts.capacity / total)) : '0');
      setText('home-room-count', String(total));
      setText('home-lab-share', `${percent(labCount)}%`);
      setText('home-lecture-share', `${percent(lectureCount)}%`);
      const labBar = byId('home-lab-bar');
      const lectureBar = byId('home-lecture-bar');
      if (labBar) labBar.style.width = `${percent(labCount)}%`;
      if (lectureBar) lectureBar.style.width = `${percent(lectureCount)}%`;
    } catch (_) {
      showRoomList([]);
      const list = byId('home-room-list');
      if (list) list.firstElementChild.textContent = 'Live inventory is temporarily unavailable';
      ['home-lab-count', 'home-lecture-count', 'home-total-capacity', 'home-average-capacity',
        'home-room-count', 'home-lab-share', 'home-lecture-share'].forEach((id) => setText(id, '—'));
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadHomeInventory, { once: true });
  } else {
    loadHomeInventory();
  }
})();
