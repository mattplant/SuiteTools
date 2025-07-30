import { z } from 'zod';

export const ScriptLogSchema = z.object({
  id: z.number(),
  timestamp: z.string(),
  type: z.string(),
  scripttype: z.string(),
  owner: z.string(),
  scriptname: z.string(),
  title: z.string(),
  detail: z.string(),
  // additional properties TODO: might be able to use zod's `extend` to add these
  urlNs: z.string().optional(),
  urlDetail: z.string().optional(),
});

export type ScriptLog = z.infer<typeof ScriptLogSchema>;
