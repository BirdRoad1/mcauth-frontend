import { Router } from 'express';
import * as noteController from '../../controllers/api/note.controller.js';
import { validateData } from '../../middleware/validation.middleware.js';
import { updateUserNoteSchema } from '../../schema/note.schema.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';
import express from 'express';

export const noteRouter = Router();

noteRouter.get('/:id', noteController.getById);
noteRouter.use(authMiddleware({ requiresLogIn: true }));
noteRouter.get('/', noteController.get);
noteRouter.post(
  '/',
  express.json(),
  validateData(updateUserNoteSchema),
  noteController.post
);
noteRouter.post(
  '/share',
  express.json(),
  validateData(updateUserNoteSchema),
  noteController.share
);
