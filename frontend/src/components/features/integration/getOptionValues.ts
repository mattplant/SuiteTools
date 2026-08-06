import { getIntegrations } from '../../../adapters/api/integrations';
import type { OptionValues } from '../../shared/criteria/types';

/**
 * Build select options from integrations.
 * @param key - When true, option `value` is the integration id; when false, the stripped name.
 * @returns Sorted option values for criteria selects.
 */
export async function getOptionValues(key: boolean): Promise<OptionValues[]> {
  const records = await getIntegrations({});
  const optionValues = records.map((record) => {
    const value = key ? record.id.toString() : record.name.replace(/<[^>]*>?/gm, '').trim();
    return {
      value: value,
      text: record.name.replace(/<[^>]*>?/gm, '').trim(),
    };
  });
  optionValues.sort((a, b) => a.text.localeCompare(b.text));

  return optionValues;
}
