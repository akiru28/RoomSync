/* profile.js — read-only profile view with focused edit and password dialogs */
document.addEventListener('DOMContentLoaded', async () => {
  if (!(await window.Auth.requireAuth())) return;

  const editDialog = document.getElementById('edit-profile-dialog');
  const passwordDialog = document.getElementById('change-password-dialog');
  const profileForm = document.getElementById('profile-form');
  const passwordForm = document.getElementById('password-form');
  const editStatus = document.getElementById('profile-status');
  const passwordStatus = document.getElementById('password-status');
  const text = (id, value) => { document.getElementById(id).textContent = value || '—'; };
  const initials = (name) => String(name || 'R S').trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase();
  const displayProfile = (user) => {
    const role = window.Auth.displayRole(user.role);
    text('pf-display-name', user.name);
    text('pf-display-email', user.email);
    text('pf-view-name', user.name);
    text('pf-view-email', user.email);
    text('pf-view-department', user.department || 'Not set');
    text('pf-view-role', role);
    document.getElementById('pf-avatar').textContent = initials(user.name);
    document.getElementById('pf-name').value = user.name || '';
    document.getElementById('pf-dept').value = user.department || '';
    document.getElementById('pf-email-edit').value = user.email || '';
    document.getElementById('pf-role-edit').value = role;
  };

  await window.Auth.ready();
  let user = window.Auth.getCurrentUser() || {};
  displayProfile(user);

  // Reservation history is available only to instructors; admins see all records,
  // which should not be presented as personal activity, and other roles see none.
  const activity = document.getElementById('profile-activity');
  if (user.role !== 'instructor') activity.hidden = true;
  else {
    try {
      const reservations = await window.Api.get('/reservations');
      const pending = reservations.filter((item) => item.status === 'pending').length;
      const approved = reservations.filter((item) => item.status === 'approved').length;
      document.getElementById('pf-stats').innerHTML = `<li>Reservations <strong>${reservations.length}</strong></li><li>Pending <strong>${pending}</strong></li><li>Approved <strong>${approved}</strong></li>`;
    } catch (error) {
      document.getElementById('pf-stats').innerHTML = '<li>Reservation summary is unavailable.</li>';
    }
  }

  document.getElementById('edit-profile-open').addEventListener('click', () => {
    editStatus.textContent = '';
    displayProfile(user);
    editDialog.showModal();
    document.getElementById('pf-name').focus();
  });
  document.getElementById('change-password-open').addEventListener('click', () => {
    passwordStatus.textContent = '';
    passwordForm.reset();
    passwordDialog.showModal();
    document.getElementById('current-password').focus();
  });
  document.querySelectorAll('[data-close-dialog]').forEach((button) => {
    button.addEventListener('click', () => button.closest('dialog').close());
  });
  [editDialog, passwordDialog].forEach((dialog) => dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  }));

  profileForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const save = profileForm.querySelector('[type="submit"]');
    save.disabled = true;
    save.textContent = 'Saving…';
    editStatus.textContent = '';
    try {
      const updated = await window.Api.patch('/users/me', {
        name: document.getElementById('pf-name').value.trim(),
        department: document.getElementById('pf-dept').value.trim(),
      });
      user = updated;
      window.Auth.setSession(window.Auth.getToken(), updated);
      displayProfile(updated);
      editDialog.close();
      window.showToast('success', 'Profile updated', 'Your profile details have been saved.');
    } catch (error) {
      editStatus.textContent = error.message;
    } finally {
      save.disabled = false;
      save.textContent = 'Save Changes';
    }
  });

  passwordForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const currentPassword = passwordForm.elements.currentPassword.value;
    const newPassword = passwordForm.elements.newPassword.value;
    const confirmPassword = passwordForm.elements.confirmPassword.value;
    if (newPassword.length < 8) {
      passwordStatus.textContent = 'Use at least 8 characters for your new password.';
      return;
    }
    if (newPassword !== confirmPassword) {
      passwordStatus.textContent = 'The new password and confirmation do not match.';
      return;
    }
    const save = passwordForm.querySelector('[type="submit"]');
    save.disabled = true;
    save.textContent = 'Saving…';
    passwordStatus.textContent = '';
    try {
      await window.Api.post('/users/me/password', { currentPassword, newPassword });
      passwordDialog.close();
      passwordForm.reset();
      window.showToast('success', 'Password changed', 'Your password has been updated.');
    } catch (error) {
      passwordStatus.textContent = error.message;
    } finally {
      save.disabled = false;
      save.textContent = 'Save Changes';
    }
  });
});
