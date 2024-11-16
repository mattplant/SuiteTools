import { getData } from '../../../utils/api';
import { OptionValues, OptionValuesTypes } from './types';

export async function getOptionValues(type: OptionValuesTypes): Promise<OptionValues[]> {
  let localTestData: OptionValues[] = [];
  switch (type) {
    case OptionValuesTypes.OWNER:
      localTestData = [
        { value: '1', text: 'Celigo' },
        { value: '2', text: 'Matt Plant' },
        { value: '3', text: 'Shopify' },
      ];
      break;
    case OptionValuesTypes.SCRIPTTYPE:
      localTestData = [
        { value: 'MAPREDUCE', text: 'Map/Reduce' },
        { value: 'RESTLET', text: 'RESTlet' },
        { value: 'SCHEDULED', text: 'Scheduled' },
        { value: 'USEREVENT', text: 'User Event' },
      ];
      break;
    case OptionValuesTypes.USER:
      localTestData = [
        { value: '1', text: 'Celigo' },
        { value: '2', text: 'Matt Plant' },
        { value: '3', text: 'Shopify' },
      ];
      break;
  }
  const data = await getData(localTestData, 'optionValues', { type: type });
  assertIsOptionValues(data);

  return data;
}

export function assertIsOptionValues(data: unknown): asserts data is OptionValues[] {
  console.log('assertIsOptionValues', data);
  if (!Array.isArray(data)) {
    throw new Error('OptionValues is not an array');
  }
  if (data.length === 0) {
    throw new Error('OptionValues is empty');
  }
  // check the data for the required fields
  // value
  if (!('value' in data[0])) {
    throw new Error('OptionValues is missing the "value" field');
  }
  if (typeof data[0].value !== 'string') {
    throw new Error('OptionValues "value" field is not a string');
  }
  // text
  if (!('text' in data[0])) {
    throw new Error('OptionValues is missing the "text" field');
  }
  if (typeof data[0].text !== 'string') {
    throw new Error('OptionValues "text" field is not a string');
  }
}
