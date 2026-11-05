import { Inventory } from '../models/medicineModel.js';
import { MedicalRecord } from '../models/medicalRecordModel.js';
import { Patient } from '../models/patientModel.js';
import { QueueEntry } from '../models/queueEntryModel.js';
import { User } from '../models/userModel.js';

export async function getDashboardSummary(_request, response, next) {
  try {
    const [patients, doctors, nurses, staff, medicalRecords, activeQueue, visitsToday, medicines] = await Promise.all([
      Patient.countDocuments(),
      User.countDocuments({ role: 'doctor', isActive: true }),
      User.countDocuments({ role: { $in: ['nurse', 'triage_nurse'] }, isActive: true }),
      User.countDocuments({ isActive: true }),
      MedicalRecord.countDocuments(),
      QueueEntry.countDocuments({ status: { $in: ['waiting', 'triage', 'in_consultation'] } }),
      QueueEntry.countDocuments({ dateKey: clinicDateKey() }),
      Inventory.countDocuments({ quantity: { $gt: 0 }, expiresOn: { $gt: new Date() } }),
    ]);
    return response.json({ patients, doctors, nurses, staff, medicalRecords, activeQueue, visitsToday, availableMedicines: medicines });
  } catch (error) {
    return next(error);
  }
}

function clinicDateKey() {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Africa/Addis_Ababa', year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(new Date());
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return `${values.year}-${values.month}-${values.day}`;
}