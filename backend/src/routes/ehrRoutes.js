import { Router } from 'express';
import { createConsultation, createSickLeave, getSickLeaves, reviewSickLeave } from '../controllers/ehrController.js';
import { requireAuth, requireRole } from '../middleware/authMiddleware.js';

const router = Router();
router.use(requireAuth);
router.post('/consultations', requireRole('admin', 'doctor'), createConsultation);
router.get('/sick-leaves', getSickLeaves);
router.post('/sick-leaves', requireRole('admin', 'doctor'), createSickLeave);
router.patch('/sick-leaves/:id', requireRole('admin', 'doctor'), reviewSickLeave);

export default router;
