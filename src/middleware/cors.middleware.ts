import type { RequestHandler } from 'express';
import { env } from '../env/env.js';

export const corsMiddleware: RequestHandler = (req, res, next) => {
  res.setHeader(
    'Access-Control-Allow-Origin',
    env.NODE_ENV === 'development' ? '*' : env.BASE_URL
  );
  res.setHeader('Access-Control-Allow-Headers', 'content-type,authorization');
  res.setHeader('Access-Control-Max-Age', '30');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST');

  if (req.method === 'OPTIONS') {
    return res.status(204).send();
  }

  next();
};
