import { getData } from '../../api/api';
import { OptionValues, OptionValuesTypes } from './types';

export async function getOptionValues(type: OptionValuesTypes): Promise<OptionValues[]> {
  let localTestData: object = {};
  switch (type) {
    case OptionValuesTypes.FILE:
      localTestData = {
        data: [
          { value: '1', text: 'File One' },
          { value: '2', text: 'File Two' },
          { value: '3', text: 'File Three' },
        ],
      };
      break;
    case OptionValuesTypes.FILETYPE:
      localTestData = {
        data: [
          { value: '1', text: 'CSV' },
          { value: '2', text: 'EXCEL' },
          { value: '3', text: 'JAVASCRIPT' },
        ],
      };
      break;
    case OptionValuesTypes.OWNER:
      localTestData = {
        data: [
          { value: '1', text: 'Celigo' },
          { value: '2', text: 'Matt Plant' },
          { value: '3', text: 'Shopify' },
        ],
      };
      break;
    case OptionValuesTypes.SCRIPT:
      localTestData = {
        data: [
          { value: '1', text: 'Script One' },
          { value: '2', text: 'Script Two' },
          { value: '3', text: 'Script Three' },
          { value: '4', text: 'Script Four' },
        ],
      };
      break;
    case OptionValuesTypes.SCRIPTTYPE:
      localTestData = {
        data: [
          { value: 'MAPREDUCE', text: 'Map/Reduce' },
          { value: 'RESTLET', text: 'RESTlet' },
          { value: 'SCHEDULED', text: 'Scheduled' },
          { value: 'USEREVENT', text: 'User Event' },
        ],
      };
      break;
    case OptionValuesTypes.USER:
      localTestData = {
        data: [
          { value: '1', text: 'Celigo' },
          { value: '2', text: 'Matt Plant' },
          { value: '3', text: 'Shopify' },
        ],
      };
      break;
  }

  // load the data from SuiteTools API unless we need to get it from NetSuite page
  let responseObject: object = {};
  const response = await getData(localTestData, 'optionValues', { type: type });
  responseObject = response.data;
  assertIsOptionValues(responseObject);

  return responseObject;
}

export function assertIsOptionValues(data: unknown): asserts data is OptionValues[] {
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
