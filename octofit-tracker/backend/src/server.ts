import cors from 'cors';
import express from 'express';
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
app.use('/api', apiRoutes);

app.listen(port, () => {
  console.log(`Octofit API listening at ${apiBaseUrl}`);
});