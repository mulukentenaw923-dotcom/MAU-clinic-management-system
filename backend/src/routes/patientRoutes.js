import { Router } from 'express';
import { getPatients, postPatient } from '../controllers/patientController.js';
import { requireAuth, requireRole } from '../middleware/authMiddleware.js';

const router = Router();
router.use(requireAuth);
router.get('/', getPatients);
router.post('/', requireRole('admin', 'doctor', 'staff'), postPatient);

export default router;
