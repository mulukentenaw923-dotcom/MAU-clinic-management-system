import mongoose from 'mongoose';
import { ContactMessage } from '../models/contactMessageModel.js';

const MESSAGE_STATUSES = ['new', 'reviewed', 'closed'];

export async function listContactMessages(request, response, next) {
  try {
    const page = Math.max(1, Number.parseInt(request.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, Number.parseInt(request.query.limit, 10) || 25));
    const status = typeof request.query.status === 'string' ? request.query.status : '';
    if (status && !MESSAGE_STATUSES.includes(status)) {
      return response.status(400).json({ error: 'Invalid message status.' });
    }

    const filter = status ? { status } : {};
    const [messages, total] = await Promise.all([
      ContactMessage.find(filter)
        .select('fullName email phone campus subject message status createdAt updatedAt')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      ContactMessage.countDocuments(filter),
    ]);
    return response.json({ messages, page, limit, total });
  } catch (error) {
    return next(error);
  }
}

export async function updateContactMessageStatus(request, response, next) {
  const { id } = request.params;
  const status = typeof request.body.status === 'string' ? request.body.status : '';
  if (!mongoose.isValidObjectId(id) || !MESSAGE_STATUSES.includes(status)) {
    return response.status(400).json({ error: 'Provide a valid message ID and status.' });
  }

  try {
    const message = await ContactMessage.findByIdAndUpdate(id, { $set: { status } }, { new: true, runValidators: true })
      .select('fullName email phone campus subject message status createdAt updatedAt')
      .lean();
    if (!message) return response.status(404).json({ error: 'Contact message not found.' });
    return response.json({ message });
  } catch (error) {
    return next(error);
  }
}