import mongoose, { type Model } from 'mongoose';
import { Activity, LeaderboardEntry, Team, User, Workout } from '../models/index.js';

const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit_db';
const userIds = [
  new mongoose.Types.ObjectId('650000000000000000000001'),
  new mongoose.Types.ObjectId('650000000000000000000002'),
  new mongoose.Types.ObjectId('650000000000000000000003')
];

/**
 * Seed the octofit_db database with test data
 */
async function upsertSeedData(
  targetModel: Model<any>,
  records: Array<Record<string, unknown> & { _id: mongoose.Types.ObjectId }>
) {
  await targetModel.bulkWrite(
    records.map(({ _id, ...fields }) => ({
      updateOne: { filter: { _id }, update: { $set: fields }, upsert: true }
    }))
  );
}

async function seedDatabase() {
  try {
    await mongoose.connect(connectionString);

    console.log('Connected to octofit_db');
    console.log('Seed the octofit_db database with test data');

    const users = [
      { _id: userIds[0], username: 'ava_runs', email: 'ava@example.com', displayName: 'Ava Chen', points: 920 },
      { _id: userIds[1], username: 'noah_cycles', email: 'noah@example.com', displayName: 'Noah Patel', points: 760 },
      { _id: userIds[2], username: 'mia_swims', email: 'mia@example.com', displayName: 'Mia Garcia', points: 680 }
    ];
    const teams = [
      {
        _id: new mongoose.Types.ObjectId('650000000000000000000101'),
        name: 'Trail Blazers',
        description: 'Weekend runners building consistency together.',
        members: [userIds[0], userIds[1]]
      },
      {
        _id: new mongoose.Types.ObjectId('650000000000000000000102'),
        name: 'Wave Riders',
        description: 'A friendly team focused on swimming and recovery.',
        members: [userIds[2]]
      }
    ];
    const activities = [
      {
        _id: new mongoose.Types.ObjectId('650000000000000000000201'),
        user: userIds[0],
        type: 'Running',
        durationMinutes: 38,
        calories: 340,
        completedAt: new Date('2026-09-28T07:30:00Z')
      },
      {
        _id: new mongoose.Types.ObjectId('650000000000000000000202'),
        user: userIds[1],
        type: 'Cycling',
        durationMinutes: 52,
        calories: 410,
        completedAt: new Date('2026-09-29T17:15:00Z')
      },
      {
        _id: new mongoose.Types.ObjectId('650000000000000000000203'),
        user: userIds[2],
        type: 'Swimming',
        durationMinutes: 30,
        calories: 280,
        completedAt: new Date('2026-09-30T06:45:00Z')
      }
    ];
    const leaderboardEntries = users.map((user) => ({
      _id: new mongoose.Types.ObjectId(`6500000000000000000003${String(users.indexOf(user) + 1).padStart(2, '0')}`),
      user: user._id,
      points: user.points,
      period: 'all-time'
    }));
    const workouts = [
      {
        _id: new mongoose.Types.ObjectId('650000000000000000000401'),
        name: 'Easy Run Builder',
        description: 'A steady session to build aerobic endurance.',
        difficulty: 'beginner',
        exercises: [{ name: 'Easy run', sets: 1, reps: 30 }]
      },
      {
        _id: new mongoose.Types.ObjectId('650000000000000000000402'),
        name: 'Full Body Strength',
        description: 'A balanced strength session for active recovery days.',
        difficulty: 'intermediate',
        exercises: [
          { name: 'Squats', sets: 3, reps: 10 },
          { name: 'Push-ups', sets: 3, reps: 8 },
          { name: 'Plank', sets: 3, reps: 30 }
        ]
      },
      {
        _id: new mongoose.Types.ObjectId('650000000000000000000403'),
        name: 'Pool Intervals',
        description: 'Short intervals with easy recovery lengths.',
        difficulty: 'advanced',
        exercises: [{ name: 'Freestyle intervals', sets: 6, reps: 100 }]
      }
    ];

    await Promise.all([
      upsertSeedData(User, users),
      upsertSeedData(Team, teams),
      upsertSeedData(Activity, activities),
      upsertSeedData(LeaderboardEntry, leaderboardEntries),
      upsertSeedData(Workout, workouts)
    ]);

    console.log('Database seeding complete');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seedDatabase();
