import { Router } from 'express';
import express from 'express';
import { pluginCallbackController } from '../../controllers/api/plugin-callback.controller.js';
import { validateData } from '../../middleware/validation.middleware.js';
import { pluginCallbackSchema } from '../../schema/plugin-callback.schema.js';

export const pluginCallbackRouter = Router();

pluginCallbackRouter.post(
  '/',
  express.json(),
  validateData(pluginCallbackSchema),
  pluginCallbackController.callbackHandler
);
