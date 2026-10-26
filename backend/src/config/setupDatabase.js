import 'dotenv/config';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { pool } from './db.js';

try {
  const schemaPath = new URL('./schema.sql', import.meta.url);
  const schema = await readFile(fileURLToPath(schemaPath), 'utf8');
  await pool.query(schema);
  console.log('Database schema is ready.');
} catch (error) {
  console.error('Could not set up the database schema.', error);
  process.exitCode = 1;
} finally {
  await pool.end();
}
