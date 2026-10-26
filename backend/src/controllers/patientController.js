import { randomUUID } from 'node:crypto';
import { createPatient, listPatientQueue, listPatients } from '../models/patientModel.js';

export async function getPatients(request, response, next) {
  try {
    const search = typeof request.query.search === 'string' ? request.query.search.trim().slice(0, 100) : '';
    return response.json(await listPatients(search));
  } catch (error) {
    return next(error);
  }
}

export async function getPatientQueue(_request, response, next) {
  try {
    return response.json(await listPatientQueue());
  } catch (error) {
    return next(error);
  }
}

export async function postPatient(request, response, next) {
  try {
    const { name, age, sex, phone } = request.body;
    const safeName = typeof name === 'string' ? name.trim() : '';
    const safePhone = typeof phone === 'string' ? phone.trim() : '';
    const numericAge = Number(age);
    if (!safeName || safeName.length > 120 || !Number.isInteger(numericAge) || numericAge < 0 || numericAge > 120
        || !['Female', 'Male', 'Other'].includes(sex) || !safePhone || safePhone.length > 40) {
      return response.status(400).json({ error: 'Provide a valid name, age, sex, and phone number.' });
    }

    const patient = await createPatient({
      patientNumber: `P-${randomUUID().slice(0, 8).toUpperCase()}`,
      name: safeName,
      age: numericAge,
      sex,
      phone: safePhone,
    });
    return response.status(201).json(patient);
  } catch (error) {
    return next(error);
  }
}
