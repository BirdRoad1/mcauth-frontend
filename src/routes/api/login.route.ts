import { Router } from 'express';
import { loginController } from '../../controllers/api/login.controller.js';
import express from 'express';
import { validateData } from '../../middleware/validation.middleware.js';
import { startLoginSchema } from '../../schema/login.schema.js';

export const loginRouter = Router();

loginRouter.post('/start', express.json(), validateData(startLoginSchema), loginController.start);

loginRouter.get('/:id/status', loginController.getStatus);

loginRouter.post('/:id/submit', loginController.submit);
