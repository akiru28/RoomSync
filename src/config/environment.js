const path = require('path');
const fs = require('fs');

const envPath = path.resolve(__dirname, '../../.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const idx = trimmed.indexOf('=');
    if (idx === -1) return;
    const key = trimmed.slice(0, idx).trim();
    const val = trimmed.slice(idx + 1).trim().replace(/^"|"$/g, '').replace(/^'|'$/g, '');
    if (!(key in process.env)) {
      process.env[key] = val;
    }
  });
}

const nodeEnv = process.env.NODE_ENV || 'development';
const port = parseInt(process.env.PORT || '3000', 10);

const requiredVars = ['JWT_SECRET'];
const missing = requiredVars.filter((v) => !process.env[v]);
if (missing.length > 0 && nodeEnv !== 'development') {
  console.warn(`[environment] Missing required env vars: ${missing.join(', ')}`);
}

const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '7d';

const config = {
  nodeEnv,
  port,
  corsOrigin: process.env.CORS_ORIGIN || '*',
  jwt: {
    secret: process.env.JWT_SECRET || 'dev-secret-change-me',
    expiresIn: jwtExpiresIn,
  },
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    name: process.env.DB_NAME || 'lecture_room_reservation',
  },
  smtp: {
    host: process.env.SMTP_HOST || 'smtp.example.com',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASSWORD || '',
    from: process.env.SMTP_FROM || 'no-reply@school.edu',
  },
  uploads: {
    dir: process.env.UPLOAD_DIR || path.resolve(__dirname, '../../uploads'),
    maxBytes: parseInt(process.env.MAX_UPLOAD_BYTES || '10485760', 10),
  },
};

module.exports = config;
