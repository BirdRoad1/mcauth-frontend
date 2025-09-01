import express from 'express';
import { apiRouter } from './routes/api/index.route.js';
import { env } from './env/env.js';
import { corsMiddleware } from './middleware/cors.middleware.js';
import './db/db.js';
import { passbuildSessionRegistry } from './registry/passbuild-session.registry.js';

const app = express();

app.use(corsMiddleware);

app.use('/api/v1', apiRouter);

app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.log('Server error', err);
    res.status(500).json({
      message: 'Internal server error'
    });
  }
);

app.listen(env.PORT, err => {
  if (err) {
    console.log(err);
    return process.exit(1);
  }

  console.log(`Listening on http://localhost:${env.PORT}`);
  passbuildSessionRegistry.scheduleCleanup();
});
