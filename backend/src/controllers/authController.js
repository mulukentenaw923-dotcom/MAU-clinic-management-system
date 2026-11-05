import bcrypt from 'bcryptjs';
import { createUser, findUserByIdentifier, USER_ROLES, User } from '../models/userModel.js';
import { signAccessToken } from '../middleware/authMiddleware.js';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function register(request, response, next) {
  try {
    const name = typeof request.body.name === 'string' ? request.body.name.trim() : '';
    const email = typeof request.body.email === 'string' ? request.body.email.trim().toLowerCase() : '';
    const username = typeof request.body.username === 'string' ? request.body.username.trim().toLowerCase() : undefined;
    const password = typeof request.body.password === 'string' ? request.body.password : '';
    const role = typeof request.body.role === 'string' ? request.body.role : 'receptionist';
    const staffId = typeof request.body.staffId === 'string' ? request.body.staffId.trim() : undefined;

    if (!name || name.length > 120 || !EMAIL_PATTERN.test(email) || (username && !/^[a-z0-9._-]{3,40}$/.test(username)) || password.length < 12 || password.length > 72
        || !USER_ROLES.includes(role) || (staffId && staffId.length > 80)) {
      return response.status(400).json({ error: 'Provide valid account details and a supported staff role.' });
    }
    if (await User.exists({ $or: [{ email }, ...(username ? [{ username }] : [])] })) {
      return response.status(409).json({ error: 'An account with that email or username already exists.' });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await createUser({ name, email, username, passwordHash, role, staffId });
    return response.status(201).json({ user });
  } catch (error) {
    return next(error);
  }
}

export async function login(request, response, next) {
  try {
    const identifier = typeof request.body.identifier === 'string'
      ? request.body.identifier.trim().toLowerCase()
      : typeof request.body.email === 'string' ? request.body.email.trim().toLowerCase() : '';
    const password = typeof request.body.password === 'string' ? request.body.password : '';
    if (!identifier || identifier.length > 254 || !password) {
      return response.status(400).json({ error: 'Provide a valid email or username and password.' });
    }

    const user = await findUserByIdentifier(identifier);
    if (!user || !user.isActive || !(await bcrypt.compare(password, user.passwordHash))) {
      return response.status(401).json({ error: 'Email or password is incorrect.' });
    }
    await User.updateOne({ _id: user._id }, { $set: { lastLoginAt: new Date() } });
    const safeUser = {
      id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,
      role: user.role,
      staffId: user.staffId,
    };
    return response.json({
      success: true,
      message: 'Login successful.',
      user: safeUser,
      accessToken: signAccessToken(user),
    });
  } catch (error) {
    return next(error);
  }
}

export async function getCurrentUser(request, response, next) {
  try {
    const user = await User.findById(request.user.id).select('name email username role staffId').lean();
    if (!user) return response.status(401).json({ error: 'User account was not found.' });
    return response.json({ user: { id: String(user._id), ...user } });
  } catch (error) {
    return next(error);
  }
}

export async function logout(request, response, next) {
  try {
    await User.updateOne({ _id: request.user.id }, { $inc: { tokenVersion: 1 } });
    return response.status(204).end();
  } catch (error) {
    return next(error);
  }
}
