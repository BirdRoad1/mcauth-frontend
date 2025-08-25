import { Router } from 'express';
import { env } from '../../env/env.js';
import { passbuildSessionRegistry } from '../../registry/passbuild-session.registry.js';
import { db } from '../../db/db.js';
import { users } from '../../db/schema.js';
import { eq } from 'drizzle-orm';
import { pbkdf2 } from '../../lib/pbkdf2.js';

export const signupRouter = Router();

signupRouter.post('/start', async (req, res) => {
  const username = req.body.username;
  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.username, username))
    .limit(1);
  if (existingUser.length > 0) {
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

  console.log('plugin said:', pluginData);
  const { id, code } = pluginData;
  const session = passbuildSessionRegistry.createSession(
    id,
    code,
    req.body.username
  );

  res.json({ id: session.id, code: session.code });
});

signupRouter.get('/:id/status', async (req, res) => {
  const id = req.params.id;
  const session = passbuildSessionRegistry.getSession(id);
  if (!session) {
    return res.status(404).json({ message: 'The session does not exist' });
  }

  res.json({
    status: session.status
  });
});

signupRouter.post('/:id/submit', async (req, res) => {
  const id = req.params.id;
  const session = passbuildSessionRegistry.getSession(id);
  if (!session) {
    return res.status(404).json({ message: 'The session does not exist' });
  }

  if (!session.passbuild) {
    return res.status(400).json({ message: 'No passbuild found' });
  }

  passbuildSessionRegistry.removeSession(id);
  await db.insert(users).values({
    username: session.username,
    passbuildHash: await pbkdf2.hash(session.passbuild)
  });

  res.json({});
});
