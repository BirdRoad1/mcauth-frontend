import { Router } from 'express';
import { signupController } from '../../controllers/api/signup.controller.js';
import { validateData } from '../../middleware/validation.middleware.js';
import { startSignupSchema } from '../../schema/signup.schema.js';
import express from 'express';

export const signupRouter = Router();

signupRouter.post('/start', express.json(), validateData(startSignupSchema), signupController.start);

signupRouter.get('/:id/status', signupController.getStatus);

signupRouter.post('/:id/submit', signupController.submit);
