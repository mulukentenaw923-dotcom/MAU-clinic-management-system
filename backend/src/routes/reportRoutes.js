import { Router } from 'express';
import { getDashboardSummary } from '../controllers/reportController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = Router();
router.get('/dashboard', requireAuth, getDashboardSummary);

export default router;