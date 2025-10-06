import { getIntegrations } from './getRecords';
import type { OptionValues } from '../../shared/criteria/types';

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
