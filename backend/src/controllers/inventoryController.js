import { createMedicine, deleteMedicine, listMedicines, updateMedicineQuantity } from '../models/medicineModel.js';

function validId(value) {
  return /^\d+$/.test(value);
}

export async function getInventory(request, response, next) {
  try {
    const search = typeof request.query.search === 'string' ? request.query.search.trim().slice(0, 100) : '';
    return response.json(await listMedicines(search));
  } catch (error) {
    return next(error);
  }
}

export async function postMedicine(request, response, next) {
  try {
    const { name, category, expiresOn } = request.body;
    const quantity = Number(request.body.quantity);
    const reorderLevel = Number(request.body.reorderLevel);
    const safeName = typeof name === 'string' ? name.trim() : '';
    const safeCategory = typeof category === 'string' ? category.trim() : '';
    if (!safeName || safeName.length > 160 || !safeCategory || safeCategory.length > 100
        || !Number.isInteger(quantity) || quantity < 0 || !Number.isInteger(reorderLevel) || reorderLevel < 0
        || (expiresOn && !/^\d{4}-\d{2}-\d{2}$/.test(expiresOn))) {
      return response.status(400).json({ error: 'Provide valid medicine details, stock, reorder level, and expiry date.' });
    }
    return response.status(201).json(await createMedicine({ name: safeName, category: safeCategory, quantity, reorderLevel, expiresOn }));
  } catch (error) {
    return next(error);
  }
}

export async function patchMedicine(request, response, next) {
  try {
    const quantity = Number(request.body.quantity);
    if (!validId(request.params.id) || !Number.isInteger(quantity) || quantity < 0) {
      return response.status(400).json({ error: 'Provide a valid medicine ID and non-negative stock quantity.' });
    }
    const medicine = await updateMedicineQuantity(request.params.id, quantity);
    if (!medicine) return response.status(404).json({ error: 'Medicine not found.' });
    return response.json(medicine);
  } catch (error) {
    return next(error);
  }
}

export async function removeMedicine(request, response, next) {
  try {
    if (!validId(request.params.id)) return response.status(400).json({ error: 'Invalid medicine ID.' });
    if (!(await deleteMedicine(request.params.id))) return response.status(404).json({ error: 'Medicine not found.' });
    return response.status(204).end();
  } catch (error) {
    return next(error);
  }
}
