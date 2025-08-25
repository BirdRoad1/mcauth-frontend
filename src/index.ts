import express from 'express';
import { apiRouter } from './routes/api/index.route.js';
import { env } from './env/env.js';
import { corsMiddleware } from './middleware/cors.middleware.js';
import './db/db.js';

const app = express();

app.use(corsMiddleware);

app.use(express.json());

app.use('/api/v1', apiRouter);

app
  .listen(env.PORT, () => {
    console.log(`Listening on http://localhost:${env.PORT}`);
  })
  .on('error', err => {
    console.log(err);
  });
