import { pool } from '../config/db.js';

export async function listMedicines(search = '') {
  const result = await pool.query(
    `SELECT id, name, category, quantity, reorder_level AS "reorderLevel",
            expires_on AS "expiresOn"
     FROM medicines
     WHERE $1 = '' OR name ILIKE '%' || $1 || '%' OR category ILIKE '%' || $1 || '%'
     ORDER BY name`,
    [search],
  );
  return result.rows;
}

export async function createMedicine({ name, category, quantity, reorderLevel, expiresOn }) {
  const result = await pool.query(
    `INSERT INTO medicines (name, category, quantity, reorder_level, expires_on)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, name, category, quantity, reorder_level AS "reorderLevel",
               expires_on AS "expiresOn"`,
    [name, category, quantity, reorderLevel, expiresOn || null],
  );
  return result.rows[0];
}

export async function updateMedicineQuantity(id, quantity) {
  const result = await pool.query(
    `UPDATE medicines SET quantity = $2
     WHERE id = $1
     RETURNING id, name, category, quantity, reorder_level AS "reorderLevel",
               expires_on AS "expiresOn"`,
    [id, quantity],
  );
  return result.rows[0] ?? null;
}

export async function deleteMedicine(id) {
  const result = await pool.query('DELETE FROM medicines WHERE id = $1 RETURNING id', [id]);
  return result.rowCount > 0;
}
