// TODO: move this to api adapter after getting it working
import type { OptionValuesTypes } from './types';

import { OptionValueBundle } from '@suiteworks/suitetools-shared';
import type { OptionValues } from '@suiteworks/suitetools-shared';

import { getData } from '../../../adapters/api/netSuiteClient';

// get option values schema
const optionValuesSchema = OptionValueBundle.schema.array();

/**
 * Fetch and validate option values for a given type.
 * @param type - The type of option values to retrieve (e.g., 'roles', 'owners', etc.).
 * @returns A Promise resolving to an array of OptionValue objects.
 * @throws {ZodError} When the response fails schema validation.
 */
export async function getOptionValues(type: OptionValuesTypes): Promise<OptionValues> {
  console.log(`getOptionValues(${type}) initiated`);

  const response = await getData('optionValues', { type: type });
  console.log('Raw option values response: %o', response);
  const data = response.data;
  console.log('Raw option values data: %o', data);
  const validatedResponse = optionValuesSchema.safeParse(data);
  console.log('Validated option values response: %o', validatedResponse);
  if (!validatedResponse.success) {
    console.error('Option values validation error: %o', validatedResponse.error);
    return [];
  }
  return validatedResponse.data;
}
