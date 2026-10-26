import { Router } from 'express';
import { getPatientQueue, getPatients, postPatient } from '../controllers/patientController.js';
import { requireAuth, requireRole } from '../middleware/authMiddleware.js';

const router = Router();
router.use(requireAuth);
router.get('/queue', getPatientQueue);
router.get('/', getPatients);
router.post('/', requireRole('admin', 'doctor', 'staff'), postPatient);

export default router;
