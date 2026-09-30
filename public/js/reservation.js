/* reservation.js — API-backed reservation submission */
document.addEventListener('DOMContentLoaded', async () => {
  if (!(await Auth.requireCanReserve())) return;
  const form = document.getElementById('reservation-form'); if (!form) return;
  const select = form.querySelector('[name="room_id"]'); select.innerHTML = '<option>Loading rooms…</option>';
  try { const rooms = await Api.get('/rooms'); select.innerHTML = '<option value="">Select a room…</option>' + rooms.map(r => `<option value="${r.id}">${r.name} (${r.capacity} pax)</option>`).join(''); }
  catch (err) { select.innerHTML = '<option value="">Unable to load rooms</option>'; window.showToast('error', 'Rooms unavailable', err.message); }
  form.addEventListener('submit', async (e) => {
    e.preventDefault(); const f = Object.fromEntries(new FormData(form).entries()); const start = new Date(f.start_time), end = new Date(f.end_time);
    if (!f.room_id || !f.purpose || Number.isNaN(start) || Number.isNaN(end) || start >= end) return window.showToast('warning', 'Check reservation details', 'Choose a room, purpose, and a valid time range.');
    const button = form.querySelector('button[type="submit"]'); button.disabled = true; button.textContent = 'Submitting…';
    try { const r = await Api.post('/reservations', { roomId: Number(f.room_id), purpose: f.purpose, startDate: start.toISOString(), endDate: end.toISOString(), attendees: Number(f.attendees || 1), notes: f.notes || '' }); window.showToast('success', 'Request submitted', `Reservation status: ${r.status}.`); setTimeout(() => location.href = 'my-reservations.html', 600); }
    catch (err) { window.showToast('error', 'Reservation not submitted', err.message); button.disabled = false; button.textContent = 'Submit Request'; }
  });
});
