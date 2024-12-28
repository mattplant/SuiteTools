import { getIntegrations } from './getRecords';
import { OptionValues } from '../criteria/types';

export async function getIntegrationOptionValues(key: boolean): Promise<OptionValues[]> {
  const records = await getIntegrations({});
  const optionValues = records.map((record) => {
    const value = key ? record.id.toString() : record.name.replace(/<[^>]*>?/gm, '').trim();
    return {
      value: value,
      text: record.name.replace(/<[^>]*>?/gm, '').trim(),
    };
  });

  return optionValues;
}
