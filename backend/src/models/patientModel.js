import { pool } from '../config/db.js';

export async function listPatients(search = '') {
  const result = await pool.query(
    `SELECT id, patient_number AS "patientNumber", name, age, sex, phone, status,
            created_at AS "createdAt"
     FROM patients
     WHERE $1 = '' OR name ILIKE '%' || $1 || '%' OR patient_number ILIKE '%' || $1 || '%'
     ORDER BY created_at DESC`,
    [search],
  );
  return result.rows;
}

export async function createPatient({ patientNumber, name, age, sex, phone }) {
  const result = await pool.query(
    `INSERT INTO patients (patient_number, name, age, sex, phone)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, patient_number AS "patientNumber", name, age, sex, phone, status`,
    [patientNumber, name, age, sex, phone],
  );
  return result.rows[0];
}

export async function findPatientById(id, client = pool) {
  const result = await client.query(
    'SELECT id, patient_number AS "patientNumber", name, age, sex, phone, status FROM patients WHERE id = $1',
    [id],
  );
  return result.rows[0] ?? null;
}
