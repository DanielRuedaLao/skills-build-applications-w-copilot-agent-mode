import { model, Schema } from 'mongoose';

const options = { timestamps: true, strict: true };

export const User = model(
  'User',
  new Schema(
    {
      username: { type: String, required: true, trim: true, unique: true },
      email: { type: String, required: true, trim: true, lowercase: true, unique: true },
      displayName: { type: String, trim: true },
      passwordHash: { type: String, required: true, select: false },
      fitnessLevel: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
      goal: { type: String, enum: ['general-fitness', 'cardio', 'strength', 'mobility'], default: 'general-fitness' },
      points: { type: Number, default: 0, min: 0 }
    },
    options
  )
);

export const Team = model(
  'Team',
  new Schema(
    {
      name: { type: String, required: true, trim: true, unique: true },
      description: { type: String, trim: true },
      members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
      createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
    },
    options
  )
);

export const Activity = model(
  'Activity',
  new Schema(
    {
      user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
      type: { type: String, required: true, trim: true },
      durationMinutes: { type: Number, required: true, min: 1 },
      calories: { type: Number, min: 0 },
      completedAt: { type: Date, default: Date.now }
    },
    options
  )
);

export const LeaderboardEntry = model(
  'LeaderboardEntry',
  new Schema(
    {
      user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
      points: { type: Number, required: true, min: 0, default: 0 },
      period: { type: String, required: true, default: 'all-time' }
    },
    options
  )
);

export const Workout = model(
  'Workout',
  new Schema(
    {
      name: { type: String, required: true, trim: true },
      description: { type: String, trim: true },
      difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
      goals: [{ type: String, enum: ['general-fitness', 'cardio', 'strength', 'mobility'] }],
      exercises: [{ name: { type: String, required: true }, sets: Number, reps: Number }]
    },
    options
  )
);