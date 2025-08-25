import { Router } from 'express';
import { signupRouter } from './signup.route.js';
import express from 'express';
import { passbuildSessionRegistry } from '../../registry/passbuild-session.registry.js';
import { pbkdf2 } from '../../lib/pbkdf2.js';

export const pluginCallbackRouter = Router();

pluginCallbackRouter.post('/', express.json(), async (req, res) => {
  const body = req.body;

  const session = passbuildSessionRegistry.getSession(body.id);
  if (!session) return res.status(404).json({ message: 'Session not found' });

  if (body.type === 'startBuilding') {
    session.status = 'BUILDING';
  } else if (body.type === 'cancel') {
    passbuildSessionRegistry.removeSession(session.id);
  } else if (body.type === 'submit') {
    session.status = 'COMPLETE';
    session.passbuild = body.data;
  }

  console.log('plugin cb:', req.body);
  res.json({});
});
