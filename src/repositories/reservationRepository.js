const { getConnection } = require('../config/database');
const { generateId } = require('../utils/generateId');

const RESERVATION_COLUMNS = `
  r.id, r.room_id AS roomId, rooms.name AS roomName,
  r.user_id AS userId, users.name AS userName, r.purpose,
  r.start_date AS startDate, r.end_date AS endDate, r.attendees, r.notes,
  r.status, r.approved_by AS approvedBy, r.approved_at AS approvedAt,
  r.created_at AS createdAt, r.updated_at AS updatedAt
`;
const BASE_QUERY = `FROM reservations r
  JOIN rooms ON rooms.id = r.room_id
  JOIN users ON users.id = r.user_id`;

async function findAll(filters) {
  const clauses = [], params = [];
  if (filters) {
    if (filters.roomId != null) { clauses.push('r.room_id = ?'); params.push(filters.roomId); }
    if (filters.userId) { clauses.push('r.user_id = ?'); params.push(filters.userId); }
    if (filters.status) { clauses.push('r.status = ?'); params.push(filters.status); }
    if (filters.start) { clauses.push('r.end_date >= ?'); params.push(filters.start); }
    if (filters.end) { clauses.push('r.start_date <= ?'); params.push(filters.end); }
  }
  const where = clauses.length ? ` WHERE ${clauses.join(' AND ')}` : '';
  const [rows] = await getConnection().execute(
    `SELECT ${RESERVATION_COLUMNS} ${BASE_QUERY}${where} ORDER BY r.start_date`,
    params
  );
  return rows;
}

async function findById(id) {
  const [rows] = await getConnection().execute(
    `SELECT ${RESERVATION_COLUMNS} ${BASE_QUERY} WHERE r.id = ? LIMIT 1`, [id]
  );
  return rows[0] || null;
}

async function findByRoomAndRange(roomId, start, end) {
  const [rows] = await getConnection().execute(
    `SELECT ${RESERVATION_COLUMNS} ${BASE_QUERY}
     WHERE r.room_id = ? AND r.start_date < ? AND r.end_date > ?
       AND r.status NOT IN ('rejected', 'cancelled')
     ORDER BY r.start_date`,
    [roomId, end, start]
  );
  return rows;
}

async function findByDateRange(start, end) {
  const [rows] = await getConnection().execute(
    `SELECT ${RESERVATION_COLUMNS} ${BASE_QUERY}
     WHERE r.start_date < ? AND r.end_date > ?
     ORDER BY r.start_date`,
    [end, start]
  );
  return rows;
}

async function create(data) {
  const id = data.id || generateId('res');
  await getConnection().execute(
    `INSERT INTO reservations
      (id, room_id, user_id, purpose, start_date, end_date, attendees, notes, status, approved_by, approved_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [id, data.roomId, data.userId, data.purpose, data.startDate, data.endDate,
      data.attendees || 1, data.notes || '', data.status || 'pending',
      data.approvedBy || null, data.approvedAt || null]
  );
  return findById(id);
}

async function update(id, patch) {
  const columns = {
    roomId: 'room_id', userId: 'user_id', purpose: 'purpose', startDate: 'start_date',
    endDate: 'end_date', attendees: 'attendees', notes: 'notes', status: 'status',
    approvedBy: 'approved_by', approvedAt: 'approved_at',
  };
  const entries = Object.entries(patch || {}).filter(([key]) => columns[key]);
  if (!entries.length) return findById(id);
  const assignments = entries.map(([key]) => `${columns[key]} = ?`).join(', ');
  const values = entries.map(([, value]) => value);
  const [result] = await getConnection().execute(
    `UPDATE reservations SET ${assignments}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
    [...values, id]
  );
  return result.affectedRows ? findById(id) : null;
}

async function remove(id) {
  const [result] = await getConnection().execute('DELETE FROM reservations WHERE id = ?', [id]);
  return result.affectedRows > 0;
}

async function updateStatus(id, status, actorId) {
  const patch = { status };
  if (status === 'approved') {
    patch.approvedBy = actorId || null;
    patch.approvedAt = new Date();
  }
  return update(id, patch);
}

async function count(filter) {
  const rows = await findAll(filter);
  return rows.length;
}

module.exports = { findAll, findById, findByRoomAndRange, findByDateRange, create, update, remove, updateStatus, count };
