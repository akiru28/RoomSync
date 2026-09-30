/**
 * Generate a short human-friendly id with prefix, timestamp and random suffix.
 * @param {string} [prefix='id'] - Id prefix
 * @returns {string}
 */
function generateId(prefix = 'id') {
  const ts = Date.now().toString(36);
  const rand = Math.random().toString(36).slice(2, 8);
  return `${prefix}_${ts}_${rand}`;
}

/**
 * Generate a bearer token shaped like a JWT.
 * @returns {string}
 */
function generateToken() {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const payload = Buffer.from(
    JSON.stringify({ iat: Math.floor(Date.now() / 1000), jti: Math.random().toString(36).slice(2, 10) })
  ).toString('base64url');
  const sig = Math.random().toString(36).slice(2, 16);
  return `${header}.${payload}.${sig}`;
}

module.exports = { generateId, generateToken };
