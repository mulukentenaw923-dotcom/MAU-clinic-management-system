import { Router } from 'express';
import { getInventory, patchMedicine, postMedicine, removeMedicine } from '../controllers/inventoryController.js';
import { requireAuth, requireRole } from '../middleware/authMiddleware.js';

const router = Router();
router.use(requireAuth);
router.get('/', getInventory);
router.post('/', requireRole('admin', 'pharmacist'), postMedicine);
router.patch('/:id', requireRole('admin', 'pharmacist'), patchMedicine);
router.delete('/:id', requireRole('admin', 'pharmacist'), removeMedicine);

export default router;
