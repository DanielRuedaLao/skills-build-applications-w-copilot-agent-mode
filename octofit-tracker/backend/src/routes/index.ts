import { Router, type Request, type Response } from 'express';
import type { Model } from 'mongoose';
import { Activity, LeaderboardEntry, Team, User, Workout } from '../models';

function resourceRouter(model: Model<any>, sort?: Record<string, 1 | -1>) {
  const router = Router();

  router.get('/', async (_request: Request, response: Response) => {
    const records = await model.find().sort(sort ?? { createdAt: -1 }).lean();
    response.json(records);
  });

  router.get('/:id', async (request: Request, response: Response) => {
    const record = await model.findById(request.params.id).lean();
    if (!record) {
      response.status(404).json({ error: 'Resource not found' });
      return;
    }
    response.json(record);
  });

  router.post('/', async (request: Request, response: Response) => {
    const record = await model.create(request.body);
    response.status(201).json(record);
  });

  return router;
}

const routes = Router();
routes.use('/users', resourceRouter(User));
routes.use('/teams', resourceRouter(Team));
routes.use('/activities', resourceRouter(Activity));
routes.use('/leaderboard', resourceRouter(LeaderboardEntry, { points: -1 }));
routes.use('/workouts', resourceRouter(Workout));

export default routes;