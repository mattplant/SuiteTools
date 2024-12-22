import { getIntegrations } from './getRecords';
import { OptionValues } from '../criteria/types';

export async function getIntegrationOptionValues(): Promise<OptionValues[]> {
  const records = await getIntegrations({});
  // for each record get key and value
  const optionValues = records.map((record) => {
    return {
      value: record.id.toString(),
      text: record.name,
    };
  });

  return optionValues;
}
