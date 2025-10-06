// schema/api/requestBody.ts
import { z } from "zod";

export const zRequestBody = z.object({
  endpoint: z.string(),
  data: z.record(z.string(), z.any()),
});

export type RequestBody = z.infer<typeof zRequestBody>;
