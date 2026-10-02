document.addEventListener('DOMContentLoaded', async () => {
  if (!(await Auth.requireRole('lab_tech', 'admin'))) return;
  const admin = Auth.isAdmin();
  const reportFormSection = document.getElementById('report-form-section');
  const equipmentSection = document.getElementById('equipment-management');
  const reportForm = document.getElementById('report-form');
  const equipmentForm = document.getElementById('equipment-form');
  const reportList = document.getElementById('reports-list');
  const equipmentList = document.getElementById('equipment-list');
  if (!reportList) return;

  if (!admin) reportFormSection.hidden = false;
  if (admin) equipmentSection.hidden = false;

  const make = (tag, text, className) => {
    const element = document.createElement(tag);
    if (text !== undefined && text !== null) element.textContent = String(text);
    if (className) element.className = className;
    return element;
  };
  const cell = (row, content) => {
    const td = document.createElement('td');
    if (content instanceof Node) td.append(content);
    else td.textContent = content == null ? '—' : String(content);
    row.append(td);
  };
  const statusLabel = (status) => ({
    reported: 'Reported',
    under_review: 'Under Review',
    in_progress: 'In Progress',
    resolved: 'Resolved',
  }[status] || status);

  let labs = [];
  let equipment = [];
  const labSelects = [
    reportForm?.elements.namedItem('roomId'),
    equipmentForm?.elements.namedItem('roomId'),
  ].filter(Boolean);

  function setSelectOptions(select, items, placeholder, label) {
    select.replaceChildren(new Option(placeholder, ''));
    items.forEach((item) => select.add(new Option(label(item), String(item.id))));
  }

  async function loadLabs() {
    const rooms = await Api.get('/rooms');
    labs = rooms.filter((room) => room.type === 'lab');
    labSelects.forEach((select) => setSelectOptions(
      select,
      labs,
      'Select a laboratory…',
      (room) => `${room.name} (${room.code})`
    ));
  }

  async function loadEquipment(roomId) {
    const query = roomId ? `?roomId=${encodeURIComponent(roomId)}` : '';
    equipment = await Api.get(`/admin/equipment${query}`);
    renderEquipment();
    const select = reportForm?.elements.namedItem('equipmentId');
    if (select) {
      const filtered = equipment.filter((item) => String(item.roomId) === String(roomId) && item.status !== 'retired');
      setSelectOptions(select, filtered, 'General laboratory issue', (item) => `${item.name} (${item.code})`);
    }
  }

  function renderReports(reports) {
    reportList.replaceChildren();
    if (!reports.length) {
      reportList.append(make('p', 'No laboratory reports found.', 'muted'));
      return;
    }
    const table = make('table', null, 'table');
    const head = document.createElement('thead');
    const headerRow = document.createElement('tr');
    ['Laboratory / Equipment', 'Issue', 'Severity', 'Reported', 'Status', 'Resolution'].forEach((title) => {
      headerRow.append(make('th', title));
    });
    if (admin) headerRow.append(make('th', 'Actions'));
    head.append(headerRow);
    const body = document.createElement('tbody');
    reports.forEach((report) => {
      const row = document.createElement('tr');
      const location = document.createElement('div');
      location.append(make('strong', report.roomName));
      location.append(make('div', report.equipmentName || 'General laboratory issue', 'muted'));
      cell(row, location);
      const issue = document.createElement('div');
      issue.append(make('strong', report.issueType));
      issue.append(make('div', report.description, 'muted'));
      if (admin) issue.append(make('div', `Reported by ${report.reporterName}`, 'muted'));
      cell(row, issue);
      cell(row, make('span', report.severity, `badge ${report.severity}`));
      cell(row, window.formatDateLocal(report.createdAt));

      if (!admin) {
        cell(row, make('span', statusLabel(report.status), `badge ${report.status}`));
        cell(row, report.resolutionNotes || '—');
      } else {
        const statusCell = document.createElement('td');
        const statusSelect = document.createElement('select');
        statusSelect.setAttribute('aria-label', `Status for ${report.roomName} report`);
        ['reported', 'under_review', 'in_progress', 'resolved'].forEach((status) => {
          statusSelect.add(new Option(statusLabel(status), status));
        });
        statusSelect.value = report.status;
        statusCell.append(statusSelect);
        row.append(statusCell);

        const resolutionCell = document.createElement('td');
        const resolution = document.createElement('textarea');
        resolution.rows = 2;
        resolution.maxLength = 10000;
        resolution.value = report.resolutionNotes || '';
        resolution.setAttribute('aria-label', `Resolution notes for ${report.roomName} report`);
        resolutionCell.append(resolution);
        row.append(resolutionCell);

        const actionCell = document.createElement('td');
        const save = make('button', 'Save', 'btn primary small');
        save.type = 'button';
        save.addEventListener('click', async () => {
          save.disabled = true;
          try {
            await Api.patch(`/reports/${encodeURIComponent(report.id)}`, {
              status: statusSelect.value,
              resolutionNotes: resolution.value,
            });
            window.showToast('success', 'Report updated', 'The issue report status was saved.');
            await loadReports();
          } catch (err) {
            window.showToast('error', 'Unable to update report', err.message);
            save.disabled = false;
          }
        });
        actionCell.append(save);
        row.append(actionCell);
      }
      body.append(row);
    });
    table.append(head, body);
    reportList.append(table);
  }

  async function loadReports() {
    reportList.replaceChildren(make('p', 'Loading reports…', 'muted'));
    try {
      renderReports(await Api.get('/reports'));
    } catch (err) {
      reportList.replaceChildren(make('p', `Unable to load reports: ${err.message}`, 'muted'));
    }
  }

  function resetEquipmentForm() {
    equipmentForm.reset();
    equipmentForm.elements.namedItem('id').value = '';
    document.getElementById('equipment-save').textContent = 'Add equipment';
    document.getElementById('equipment-cancel').hidden = true;
  }

  function renderEquipment() {
    if (!admin || !equipmentList) return;
    equipmentList.replaceChildren();
    if (!equipment.length) {
      equipmentList.append(make('p', 'No equipment records found.', 'muted'));
      return;
    }
    const roomsById = new Map(labs.map((room) => [String(room.id), room]));
    const table = make('table', null, 'table');
    const head = document.createElement('thead');
    const headerRow = document.createElement('tr');
    ['Equipment', 'Laboratory', 'Status', 'Actions'].forEach((title) => headerRow.append(make('th', title)));
    head.append(headerRow);
    const body = document.createElement('tbody');
    equipment.forEach((item) => {
      const row = document.createElement('tr');
      const details = document.createElement('div');
      details.append(make('strong', item.name));
      details.append(make('div', item.code, 'muted'));
      cell(row, details);
      cell(row, roomsById.get(String(item.roomId))?.name || 'Unknown laboratory');
      cell(row, make('span', item.status, `badge ${item.status}`));
      const actions = document.createElement('td');
      const edit = make('button', 'Edit', 'btn ghost small');
      edit.type = 'button';
      edit.addEventListener('click', () => {
        equipmentForm.elements.namedItem('id').value = item.id;
        equipmentForm.elements.namedItem('roomId').value = item.roomId;
        equipmentForm.elements.namedItem('code').value = item.code;
        equipmentForm.elements.namedItem('name').value = item.name;
        equipmentForm.elements.namedItem('status').value = item.status;
        equipmentForm.elements.namedItem('description').value = item.description || '';
        document.getElementById('equipment-save').textContent = 'Save equipment';
        document.getElementById('equipment-cancel').hidden = false;
        equipmentForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
      actions.append(edit);
      if (item.status !== 'retired') {
        const retire = make('button', 'Retire', 'btn danger small');
        retire.type = 'button';
        retire.addEventListener('click', async () => {
          retire.disabled = true;
          try {
            await Api.delete(`/admin/equipment/${encodeURIComponent(item.id)}`);
            await loadEquipment(equipmentForm.elements.namedItem('roomId').value);
          } catch (err) {
            window.showToast('error', 'Unable to retire equipment', err.message);
            retire.disabled = false;
          }
        });
        actions.append(retire);
      }
      row.append(actions);
      body.append(row);
    });
    table.append(head, body);
    equipmentList.append(table);
  }

  try {
    await loadLabs();
    if (admin) await loadEquipment();
    else {
      const options = reportForm.elements.namedItem('roomId');
      options.addEventListener('change', () => {
        const equipmentSelect = reportForm.elements.namedItem('equipmentId');
        setSelectOptions(equipmentSelect, [], 'Loading equipment…', () => '');
        if (options.value) {
          Api.get(`/rooms/${encodeURIComponent(options.value)}/equipment`)
            .then((items) => setSelectOptions(
              equipmentSelect,
              items,
              'General laboratory issue',
              (item) => `${item.name} (${item.code})`
            ))
            .catch((err) => {
              setSelectOptions(equipmentSelect, [], 'Unable to load equipment', () => '');
              window.showToast('error', 'Unable to load equipment', err.message);
            });
        } else {
          setSelectOptions(equipmentSelect, [], 'General laboratory issue', () => '');
        }
      });
    }
  } catch (err) {
    window.showToast('error', 'Laboratories unavailable', err.message);
  }

  reportForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(reportForm).entries());
    const submit = reportForm.querySelector('button[type="submit"]');
    submit.disabled = true;
    try {
      await Api.post('/reports', {
        roomId: Number(data.roomId),
        equipmentId: data.equipmentId || null,
        issueType: data.issueType,
        severity: data.severity,
        description: data.description,
      });
      reportForm.reset();
      document.getElementById('report-form-status').textContent = 'Report submitted.';
      window.showToast('success', 'Report submitted', 'Admin can now review this issue.');
      await loadReports();
    } catch (err) {
      window.showToast('error', 'Report not submitted', err.message);
    } finally {
      submit.disabled = false;
    }
  });

  if (admin) {
    equipmentForm.elements.namedItem('roomId').addEventListener('change', (event) => loadEquipment(event.target.value));
    document.getElementById('equipment-cancel').addEventListener('click', resetEquipmentForm);
    equipmentForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const data = Object.fromEntries(new FormData(equipmentForm).entries());
      const id = data.id;
      const payload = {
        roomId: Number(data.roomId),
        code: data.code,
        name: data.name,
        status: data.status,
        description: data.description,
      };
      const save = document.getElementById('equipment-save');
      save.disabled = true;
      try {
        if (id) await Api.patch(`/admin/equipment/${encodeURIComponent(id)}`, payload);
        else await Api.post('/admin/equipment', payload);
        resetEquipmentForm();
        await loadEquipment();
        window.showToast('success', 'Equipment saved', 'The equipment inventory was updated.');
      } catch (err) {
        window.showToast('error', 'Equipment not saved', err.message);
      } finally {
        save.disabled = false;
      }
    });
  }
  await loadReports();
});
