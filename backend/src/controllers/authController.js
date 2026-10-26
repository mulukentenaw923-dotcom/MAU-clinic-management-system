import bcrypt from 'bcryptjs';
import { createUser, findUserByEmail } from '../models/userModel.js';
import { signAccessToken } from '../middleware/authMiddleware.js';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function register(request, response, next) {
  try {
    const name = typeof request.body.name === 'string' ? request.body.name.trim() : '';
    const email = typeof request.body.email === 'string' ? request.body.email.trim().toLowerCase() : '';
    const password = typeof request.body.password === 'string' ? request.body.password : '';

    if (!name || name.length > 120 || !EMAIL_PATTERN.test(email) || password.length < 12 || password.length > 72) {
      return response.status(400).json({ error: 'Provide a name, valid email, and password of 12–72 characters.' });
    }
    if (await findUserByEmail(email)) {
      return response.status(409).json({ error: 'An account with that email already exists.' });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await createUser({ name, email, passwordHash });
    return response.status(201).json({ user, accessToken: signAccessToken(user) });
  } catch (error) {
    return next(error);
  }
}

export async function login(request, response, next) {
  try {
    const email = typeof request.body.email === 'string' ? request.body.email.trim().toLowerCase() : '';
    const password = typeof request.body.password === 'string' ? request.body.password : '';
    if (!EMAIL_PATTERN.test(email) || !password) {
      return response.status(400).json({ error: 'Provide a valid email and password.' });
    }

    const user = await findUserByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return response.status(401).json({ error: 'Email or password is incorrect.' });
    }
    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
    return response.json({ user: safeUser, accessToken: signAccessToken(user) });
  } catch (error) {
    return next(error);
  }
}
