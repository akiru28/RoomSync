/* calendar.js — API-backed schedule list; API does not expose a public all-schedule endpoint */
document.addEventListener('DOMContentLoaded', async () => {
  if (!(await Auth.requireAuth())) return; const root = document.getElementById('calendar'); root.innerHTML = '<p class="muted">Loading schedule…</p>';
  try { const reservations = await Api.get(Auth.isAdmin() ? '/admin/reservations' : '/reservations'); root.innerHTML = reservations.length ? `<table class="table"><thead><tr><th>Room</th><th>Start</th><th>End</th><th>Status</th></tr></thead><tbody>${reservations.map(r => `<tr><td>${r.roomName}</td><td>${formatDateLocal(r.startDate)}</td><td>${formatDateLocal(r.endDate)}</td><td><span class="badge ${r.status}">${r.status}</span></td></tr>`).join('')}</tbody></table>` : '<p class="muted">No reservations found.</p>'; }
  catch (err) { root.innerHTML = `<p class="muted">Unable to load schedule: ${err.message}</p>`; }
});
