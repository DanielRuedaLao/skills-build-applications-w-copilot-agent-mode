import { Router } from 'express';
import { Activity, LeaderboardEntry, Team, User, Workout } from '../models/index.js';
import { requireAuth } from '../middleware/auth.js';
import authRoutes from './auth.js';

const routes = Router();
const activityTypes = ['Running', 'Walking', 'Cycling', 'Swimming', 'Strength', 'Yoga', 'Other'];
const difficultyOrder = ['beginner', 'intermediate', 'advanced'];

function authenticatedUserId(request: { authUserId?: string }, response: import('express').Response) {
  if (!request.authUserId) {
    response.status(401).json({ error: 'Authentication required' });
    return undefined;
  }
  return request.authUserId;
}

routes.use('/auth', authRoutes);
routes.use(requireAuth);

routes.get('/users', async (_request, response) => {
  const users = await User.find().select('username displayName points fitnessLevel goal').sort({ points: -1 }).lean();
  response.json(users);
});

routes.get('/teams', async (_request, response) => {
  const teams = await Team.find().populate('members', 'username displayName').sort({ createdAt: -1 }).lean();
  response.json(teams);
});

routes.post('/teams', async (request, response) => {
  const { name, description } = request.body ?? {};
  if (typeof name !== 'string' || !name.trim() || name.trim().length > 60) {
    response.status(400).json({ error: 'Team name must be 1-60 characters' });
    return;
  }
  if (description !== undefined && (typeof description !== 'string' || description.length > 240)) {
    response.status(400).json({ error: 'Team description must be 240 characters or fewer' });
    return;
  }
  const userId = authenticatedUserId(request, response);
  if (!userId) return;

  const team = await Team.create({
    name: name.trim(),
    description: typeof description === 'string' ? description.trim() : '',
    members: [userId],
    createdBy: userId
  });
  response.status(201).json(team);
});

routes.post('/teams/:id/join', async (request, response) => {
  const userId = authenticatedUserId(request, response);
  if (!userId) return;
  const team = await Team.findByIdAndUpdate(
    request.params.id,
    { $addToSet: { members: userId } },
    { returnDocument: 'after', runValidators: true }
  ).populate('members', 'username displayName');
  if (!team) {
    response.status(404).json({ error: 'Team not found' });
    return;
  }
  response.json(team);
});

routes.get('/activities', async (_request, response) => {
  const activities = await Activity.find().populate('user', 'username displayName').sort({ completedAt: -1 }).lean();
  response.json(activities);
});

routes.post('/activities', async (request, response) => {
  const { type, durationMinutes, calories, completedAt } = request.body ?? {};
  if (typeof type !== 'string' || !activityTypes.includes(type)) {
    response.status(400).json({ error: 'Choose a supported activity type' });
    return;
  }
  if (!Number.isInteger(durationMinutes) || durationMinutes < 1 || durationMinutes > 1440) {
    response.status(400).json({ error: 'Duration must be between 1 and 1440 minutes' });
    return;
  }
  if (calories !== undefined && (!Number.isFinite(calories) || calories < 0 || calories > 20000)) {
    response.status(400).json({ error: 'Calories must be between 0 and 20000' });
    return;
  }
  if (completedAt !== undefined && Number.isNaN(Date.parse(completedAt))) {
    response.status(400).json({ error: 'Completion date must be valid' });
    return;
  }
  const userId = authenticatedUserId(request, response);
  if (!userId) return;

  const activity = await Activity.create({
    user: userId,
    type,
    durationMinutes,
    calories,
    completedAt
  });
  const pointsEarned = durationMinutes;
  await Promise.all([
    User.findByIdAndUpdate(userId, { $inc: { points: pointsEarned } }),
    LeaderboardEntry.findOneAndUpdate(
      { user: userId, period: 'all-time' },
      { $inc: { points: pointsEarned } },
      { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
    )
  ]);
  response.status(201).json({ activity, pointsEarned });
});

routes.get('/leaderboard', async (request, response) => {
  const period = typeof request.query.period === 'string' ? request.query.period : 'all-time';
  const entries = await LeaderboardEntry.find({ period })
    .populate('user', 'username displayName')
    .sort({ points: -1 })
    .lean();
  response.json(entries);
});

routes.get('/workouts/recommended', async (request, response) => {
  const userId = authenticatedUserId(request, response);
  if (!userId) return;
  const user = await User.findById(userId).select('fitnessLevel goal').lean();
  if (!user) {
    response.status(404).json({ error: 'User not found' });
    return;
  }
  const fitnessLevel = user.fitnessLevel || 'beginner';
  const difficultyLevels = difficultyOrder.slice(0, difficultyOrder.indexOf(fitnessLevel) + 1);
  const workouts = await Workout.find()
    .where('difficulty')
    .in(difficultyLevels.length ? difficultyLevels : ['beginner'])
    .or([{ goals: user.goal }, { goals: 'general-fitness' }, { goals: { $size: 0 } }])
    .sort({ difficulty: 1, name: 1 })
    .lean();
  response.json(workouts);
});

routes.get('/workouts', async (_request, response) => {
  const workouts = await Workout.find().sort({ name: 1 }).lean();
  response.json(workouts);
});

routes.get('/workouts/:id', async (request, response) => {
  const workout = await Workout.findById(request.params.id).lean();
  if (!workout) {
    response.status(404).json({ error: 'Workout not found' });
    return;
  }
  response.json(workout);
});

export default routes;