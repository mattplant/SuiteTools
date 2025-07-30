import { ScriptLog, ScriptLogSchema } from './scriptLogs.types';

export function assertIsScriptLog(data: unknown): asserts data is ScriptLog {
  ScriptLogSchema.parse(data); // throws if invalid
}

export function assertIsScriptLogs(data: unknown): asserts data is ScriptLog[] {
  const schema = ScriptLogSchema.array();
  schema.parse(data); // throws if invalid
}

export function parseScriptLog(data: unknown): ScriptLog {
  return ScriptLogSchema.parse(data); // throws if invalid
}

export function parseScriptLogs(data: unknown): {
  validLogs: ScriptLog[];
  errorCount: number;
  errorDetails: string[];
} {
  if (!Array.isArray(data)) {
    throw new Error('Expected an array of script logs');
  }

  const results = data.map((item, index) => {
    const result = ScriptLogSchema.safeParse(item);
    return result.success
      ? { success: true, data: result.data }
      : { success: false, error: `Index ${index}: ${result.error.message}` };
  });

  const validLogs = results.filter((r): r is { success: true; data: ScriptLog } => r.success).map((r) => r.data);
  const errorDetails = results
    .filter((r) => !r.success)
    .map((r) => r.error)
    .filter((error): error is string => typeof error === 'string');

  return {
    validLogs,
    errorCount: errorDetails.length,
    errorDetails,
  };
}
