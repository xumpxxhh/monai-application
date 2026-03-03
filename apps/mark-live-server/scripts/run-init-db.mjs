import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const config = {
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'admin123',
  multipleStatements: true,
};

async function run() {
  const sqlPath = path.join(__dirname, 'init-db.sql');
  const sql = fs.readFileSync(sqlPath, 'utf8');

  console.log('Connecting to MySQL...');
  const conn = await mysql.createConnection(config);

  try {
    console.log('Executing init-db.sql...');
    await conn.query(sql);
    console.log('Done. Database mark_live_db and table bill created (if not exists).');
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  } finally {
    await conn.end();
  }
}

run();
