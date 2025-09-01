import type { Request, Response } from 'express';
import { passbuildSessionRegistry } from '../../registry/passbuild-session.registry.js';
import type z from 'zod';
import type { pluginCallbackSchema } from '../../schema/plugin-callback.schema.js';

export const callbackHandler = async (
  req: Request<never, never, z.infer<typeof pluginCallbackSchema>>,
  res: Response
) => {
  const body = req.body;

  const session = passbuildSessionRegistry.getSession(body.id);
  if (!session) return res.status(404).json({ message: 'Session not found' });

  switch (body.type) {
    case 'startBuilding':
      session.status = 'BUILDING';
      break;
    case 'cancel':
      passbuildSessionRegistry.removeSession(session.id);
      break;
    case 'submit':
      session.status = 'COMPLETE';
      session.passbuild = body.data;
      break;
  }

  res.json({});
};

export const pluginCallbackController = Object.freeze({ callbackHandler });
