import z from 'zod';

export const pluginCallbackSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('startBuilding'),
    id: z.uuid(),
    code: z.string(),
    playerUUID: z.uuid()
  }),
  z.object({
    type: z.literal('cancel'),
    id: z.uuid(),
    code: z.string(),
    playerUUID: z.uuid()
  }),
  z.object({
    type: z.literal('submit'),
    id: z.uuid(),
    code: z.string(),
    playerUUID: z.uuid(),
    data: z.string()
  })
]);
