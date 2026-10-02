import cors from 'cors';
import express from 'express';
import type { ErrorRequestHandler } from 'express';
import './config/database.js';
import apiRoutes from './routes/index.js';

const app = express();
const port = Number(process.env.PORT) || 8000;
const codespaceName = process.env.CODESPACE_NAME;
const apiBaseUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : `http://localhost:${port}`;
const allowedOrigins = new Set([
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  ...(codespaceName ? [`https://${codespaceName}-5173.app.github.dev`] : [])
]);

app.use(cors({ origin: (origin, callback) => callback(null, !origin || allowedOrigins.has(origin)) }));
app.use(express.json());
app.get('/api/', (_request, response) => {
  response.json({ name: 'Octofit Tracker API', baseUrl: apiBaseUrl });
});
app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok' });
});
app.use('/api', apiRoutes);

const handleApiError: ErrorRequestHandler = (error, _request, response, _next) => {
  if (error?.name === 'ValidationError' || error?.name === 'CastError') {
    response.status(400).json({ error: 'Invalid request data' });
    return;
  }
  if (error?.code === 11000) {
    response.status(409).json({ error: 'That username, email, or team name is already in use' });
    return;
  }
  console.error('API request failed:', error);
  response.status(500).json({ error: 'The request could not be completed' });
};

app.use(handleApiError);

app.listen(port, () => {
  console.log(`Octofit API listening at ${apiBaseUrl}`);
});