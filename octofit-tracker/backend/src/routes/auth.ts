import bcrypt from 'bcryptjs';
import { Router } from 'express';
import { User } from '../models/index.js';
import { createToken, requireAuth } from '../middleware/auth.js';

const router = Router();
const fitnessLevels = ['beginner', 'intermediate', 'advanced'];
const fitnessGoals = ['general-fitness', 'cardio', 'strength', 'mobility'];

function publicUser(user: {
  _id: unknown;
  username: string;
  email: string;
  displayName?: string | null;
  fitnessLevel: string;
  goal: string;
  points: number;
}) {
  return {
    id: String(user._id),
    username: user.username,
    email: user.email,
    displayName: user.displayName,
    fitnessLevel: user.fitnessLevel,
    goal: user.goal,
    points: user.points
  };
}

router.post('/register', async (request, response) => {
  const { username, email, displayName, password, fitnessLevel, goal } = request.body ?? {};
  if (typeof username !== 'string' || !/^[a-zA-Z0-9_-]{3,24}$/.test(username.trim())) {
    response.status(400).json({ error: 'Username must be 3-24 letters, numbers, underscores, or hyphens' });
    return;
  }
  if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    response.status(400).json({ error: 'A valid email is required' });
    return;
  }
  if (typeof password !== 'string' || password.length < 8 || Buffer.byteLength(password) > 72) {
    response.status(400).json({ error: 'Password must contain 8-72 bytes' });
    return;
  }
  if (fitnessLevel !== undefined && !fitnessLevels.includes(fitnessLevel)) {
    response.status(400).json({ error: 'Invalid fitness level' });
    return;
  }
  if (goal !== undefined && !fitnessGoals.includes(goal)) {
    response.status(400).json({ error: 'Invalid fitness goal' });
    return;
  }

  const user = await User.create({
    username: username.trim().toLowerCase(),
    email: email.trim().toLowerCase(),
    displayName: typeof displayName === 'string' ? displayName.trim() : undefined,
    passwordHash: await bcrypt.hash(password, 12),
    fitnessLevel,
    goal
  });
  response.status(201).json({ token: createToken(String(user._id)), user: publicUser(user) });
});

router.post('/login', async (request, response) => {
  const { identifier, password } = request.body ?? {};
  if (typeof identifier !== 'string' || typeof password !== 'string') {
    response.status(400).json({ error: 'Username or email and password are required' });
    return;
  }

  const normalizedIdentifier = identifier.trim().toLowerCase();
  const user = await User.findOne({
    $or: [{ username: normalizedIdentifier }, { email: normalizedIdentifier }]
  }).select('+passwordHash');
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    response.status(401).json({ error: 'Incorrect username/email or password' });
    return;
  }

  response.json({ token: createToken(String(user._id)), user: publicUser(user) });
});

router.get('/me', requireAuth, async (request, response) => {
  const user = await User.findById(request.authUserId);
  if (!user) {
    response.status(404).json({ error: 'User not found' });
    return;
  }
  response.json(publicUser(user));
});

router.patch('/profile', requireAuth, async (request, response) => {
  const { displayName, fitnessLevel, goal } = request.body ?? {};
  const updates: Record<string, string> = {};

  if (displayName !== undefined) {
    if (typeof displayName !== 'string' || displayName.trim().length > 80) {
      response.status(400).json({ error: 'Display name must be 80 characters or fewer' });
      return;
    }
    updates.displayName = displayName.trim();
  }
  if (fitnessLevel !== undefined) {
    if (!fitnessLevels.includes(fitnessLevel)) {
      response.status(400).json({ error: 'Invalid fitness level' });
      return;
    }
    updates.fitnessLevel = fitnessLevel;
  }
  if (goal !== undefined) {
    if (!fitnessGoals.includes(goal)) {
      response.status(400).json({ error: 'Invalid fitness goal' });
      return;
    }
    updates.goal = goal;
  }

  const user = await User.findByIdAndUpdate(request.authUserId, { $set: updates }, { returnDocument: 'after', runValidators: true });
  if (!user) {
    response.status(404).json({ error: 'User not found' });
    return;
  }
  response.json(publicUser(user));
});

export default router;
