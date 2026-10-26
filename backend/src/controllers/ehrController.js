import { pool } from '../config/db.js';
import { findPatientById } from '../models/patientModel.js';

function validId(value) {
  return typeof value === 'string' && /^\d+$/.test(value);
}

function validDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.valueOf()) && date.toISOString().slice(0, 10) === value;
}

export async function createConsultation(request, response, next) {
  const patientId = request.body.patientId;
  const diagnosis = typeof request.body.diagnosis === 'string' ? request.body.diagnosis.trim() : '';
  const notes = typeof request.body.notes === 'string' ? request.body.notes.trim() : '';
  const medicine = typeof request.body.medicine === 'string' ? request.body.medicine.trim() : '';
  const instructions = typeof request.body.instructions === 'string' ? request.body.instructions.trim() : '';
  if (!validId(String(patientId ?? '')) || !diagnosis || diagnosis.length > 5000 || notes.length > 10000) {
    return response.status(400).json({ error: 'Provide a valid patient and diagnosis.' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const patient = await findPatientById(String(patientId), client);
    if (!patient) {
      await client.query('ROLLBACK');
      return response.status(404).json({ error: 'Patient not found.' });
    }

    const consultationResult = await client.query(
      `INSERT INTO consultations (patient_id, doctor_id, diagnosis, notes)
       VALUES ($1, $2, $3, $4)
       RETURNING id, patient_id AS "patientId", doctor_id AS "doctorId", diagnosis, notes,
                 created_at AS "createdAt"`,
      [patient.id, request.user.id, diagnosis, notes],
    );
    if (medicine) {
      await client.query(
        `INSERT INTO prescriptions (patient_id, consultation_id, medicine_name, instructions)
         VALUES ($1, $2, $3, $4)`,
        [patient.id, consultationResult.rows[0].id, medicine, instructions],
      );
    }
    await client.query("UPDATE patients SET status = 'Completed' WHERE id = $1", [patient.id]);
    await client.query('COMMIT');
    return response.status(201).json(consultationResult.rows[0]);
  } catch (error) {
    await client.query('ROLLBACK');
    return next(error);
  } finally {
    client.release();
  }
}

export async function createSickLeave(request, response, next) {
  try {
    const { patientId, startsOn, endsOn, reason } = request.body;
    const safeReason = typeof reason === 'string' ? reason.trim() : '';
    if (!validId(String(patientId ?? '')) || !validDate(startsOn)
        || !validDate(endsOn) || endsOn < startsOn || !safeReason || safeReason.length > 1000) {
      return response.status(400).json({ error: 'Provide a patient, valid date range, and reason.' });
    }
    const patient = await findPatientById(String(patientId));
    if (!patient) return response.status(404).json({ error: 'Patient not found.' });

    const result = await pool.query(
      `INSERT INTO sick_leaves (patient_id, requested_by, starts_on, ends_on, reason)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, patient_id AS "patientId", starts_on AS "startsOn",
                 ends_on AS "endsOn", reason, status, created_at AS "createdAt"`,
      [patient.id, request.user.id, startsOn, endsOn, safeReason],
    );
    return response.status(201).json(result.rows[0]);
  } catch (error) {
    return next(error);
  }
}

export async function getSickLeaves(request, response, next) {
  try {
    const result = await pool.query(
      `SELECT sl.id, sl.patient_id AS "patientId", p.name AS "patientName",
              sl.starts_on AS "startsOn", sl.ends_on AS "endsOn", sl.reason,
              sl.status, sl.created_at AS "createdAt"
       FROM sick_leaves sl JOIN patients p ON p.id = sl.patient_id
       ORDER BY sl.created_at DESC`,
    );
    return response.json(result.rows);
  } catch (error) {
    return next(error);
  }
}

export async function reviewSickLeave(request, response, next) {
  try {
    const { id } = request.params;
    const { status } = request.body;
    if (!validId(id) || !['Approved', 'Declined'].includes(status)) {
      return response.status(400).json({ error: 'Provide a valid request ID and review decision.' });
    }
    const result = await pool.query(
      `UPDATE sick_leaves SET status = $2, reviewed_by = $3
       WHERE id = $1 AND status = 'Pending'
       RETURNING id, patient_id AS "patientId", starts_on AS "startsOn",
                 ends_on AS "endsOn", reason, status`,
      [id, status, request.user.id],
    );
    if (!result.rowCount) return response.status(404).json({ error: 'Pending sick leave request not found.' });
    return response.json(result.rows[0]);
  } catch (error) {
    return next(error);
  }
}
