import { Router } from 'express';
import { signupRouter } from './signup.route.js';
import { pluginCallbackRouter } from './plugin-callback.route.js';
import { loginRouter } from './login.route.js';
import { noteRouter } from './note.route.js';

export const apiRouter = Router();

apiRouter.use('/signup', signupRouter);
apiRouter.use('/login', loginRouter);
apiRouter.use('/note', noteRouter)
apiRouter.use('/plugin-callback', pluginCallbackRouter);
