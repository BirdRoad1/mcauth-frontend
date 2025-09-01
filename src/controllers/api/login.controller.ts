import {
  Router,
  type Request,
  type Response
} from 'express';
import { env } from '../../env/env.js';
import { passbuildSessionRegistry } from '../../registry/passbuild-session.registry.js';
import jwt from '../../lib/jwt.js';
import { pbkdf2 } from '../../lib/pbkdf2.js';
import * as User from '../../models/user.model.js';
import type z from 'zod';
import type { startLoginSchema } from '../../schema/login.schema.js';

export const loginRouter = Router();

const start = async (
  req: Request<never, never, z.infer<typeof startLoginSchema>>,
  res: Response
) => {
  const username = req.body.username;
  const existingUser = await User.getByUsername(username);
  if (!existingUser) {
    return res.status(409).json({ message: 'The user does not exist' });
  }

  let pluginData;
  try {
    const pluginRes = await fetch(`${env.PLUGIN_URL}/code/create`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        callbackUrl: `${env.SERVER_URL}/api/v1/plugin-callback`
      })
    });

    if (!pluginRes.ok) {
      console.log(await pluginRes.text());
      return res
        .status(500)
        .json({ message: 'Signup context creation failed' });
    }

    pluginData = await pluginRes.json();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Signup context creation failed' });
  }

  const { id, code } = pluginData;
  const session = passbuildSessionRegistry.createSession(
    id,
    code,
    req.body.username
  );

  res.json({ id: session.id, code: session.code });
};

const getStatus = async (req: Request<{ id: string }>, res: Response) => {
  const id = req.params.id;
  const session = passbuildSessionRegistry.getSession(id);
  if (!session) {
    return res.status(404).json({ message: 'The session does not exist' });
  }

  res.json({
    status: session.status
  });
};

const submit = async (req: Request<{ id: string }>, res: Response) => {
  const id = req.params.id;
  const session = passbuildSessionRegistry.getSession(id);
  if (!session) {
    return res.status(404).json({ message: 'The session does not exist' });
  }

  if (!session.passbuild) {
    return res.status(400).json({ message: 'No passbuild found' });
  }

  passbuildSessionRegistry.removeSession(id);
  const user = await User.getByUsername(session.username);

  if (!user) {
    return res.status(404).json({
      message: 'The user does not exist'
    });
  }

  if ((await pbkdf2.verify(session.passbuild, user.passbuildHash)) !== true) {
    return res.status(401).json({ message: 'Incorrect passbuild' });
  }

  const token = jwt.sign(
    {
      id: user.id
    },
    {
      expiresIn: '60 mins'
    }
  );

  res.json({
    token
  });
};

export const loginController = Object.freeze({ start, getStatus, submit });
