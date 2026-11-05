import { Router } from 'express';
import { listContactMessages, updateContactMessageStatus } from '../controllers/contactController.js';
import { requireAuth, requireRole } from '../middleware/authMiddleware.js';

const router = Router();
router.use(requireAuth, requireRole('super_admin', 'administrator'));
router.get('/messages', listContactMessages);
router.patch('/messages/:id/status', updateContactMessageStatus);

export default router;