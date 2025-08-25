import {
  Router,
  type Request,
  type RequestHandler,
  type Response
} from 'express';
import { env } from '../../env/env.js';
import { passbuildSessionRegistry } from '../../registry/passbuild-session.registry.js';
import { pbkdf2 } from '../../lib/pbkdf2.js';
import { User } from '../../models/user.model.js';

export const signupRouter = Router();

const start: RequestHandler = async (req, res) => {
  const username = req.body.username;
  const existingUser = User.getByUsername(username);
  if (!existingUser) {
    return res.status(409).json({ message: 'The username is already taken' });
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
  await User.create(session.username, await pbkdf2.hash(session.passbuild));

  res.json({});
};

export const signupController = Object.freeze({
  start,
  getStatus,
  submit
});
