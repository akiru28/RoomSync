document.addEventListener('DOMContentLoaded', async () => {
  if (!(await Auth.requireAuth())) return; const root = document.getElementById('my-reservations');
  try { const rows = await Api.get('/reservations'); if (!rows.length) { root.innerHTML = '<p class="muted">No reservation requests found.</p>'; return; }
    root.innerHTML = `<table class="table"><thead><tr><th>Room</th><th>Schedule</th><th>Purpose</th><th>Attendees</th><th>Status</th><th></th></tr></thead><tbody>${rows.map(r => `<tr><td>${r.roomName}</td><td>${formatDateLocal(r.startDate)} – ${formatTime(r.endDate)}</td><td>${r.purpose}</td><td>${r.attendees}</td><td><span class="badge ${r.status}">${r.status}</span></td><td>${['pending','approved'].includes(r.status) ? `<button class="btn ghost small" data-cancel="${r.id}">Cancel</button>` : ''}</td></tr>`).join('')}</tbody></table>`;
    root.addEventListener('click', async (e) => { const id = e.target.dataset.cancel; if (!id) return; e.target.disabled = true; try { await Api.patch(`/reservations/${id}/status`, { status: 'cancelled' }); window.showToast('success', 'Reservation cancelled', 'Your reservation was cancelled.'); location.reload(); } catch (err) { e.target.disabled = false; window.showToast('error', 'Unable to cancel', err.message); } });
  } catch (err) { root.innerHTML = `<p class="muted">Unable to load reservations: ${err.message}</p>`; }
});
