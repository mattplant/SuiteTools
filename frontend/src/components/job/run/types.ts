export interface JobRun {
  id: number; // internalid
  created: string;
  jobid: number;
  jobname: string;
  completed?: boolean;
  results?: string;
  // additional properties
  urlDetail?: string;
  urlJob?: string;
}

export function assertIsJobRun(data: unknown): asserts data is JobRun {
  if (typeof data !== 'object' || data === null) {
    throw new Error('Job Run data is not an object');
  }
  // check the data for the required fields
  // id
  if (!('id' in data)) {
    throw new Error('Job Run data is missing the "id" field');
  }
  if (typeof data.id !== 'number') {
    throw new Error('Job Run data "id" field is not a number');
  }
  // created
  if (!('created' in data)) {
    throw new Error('Job Run data is missing the "created" field');
  }
  if (typeof data.created !== 'string') {
    throw new Error('Job Run data "created" field is not a string (date)');
  }
  // jobid
  if (!('jobid' in data)) {
    throw new Error('Job Run data is missing the "jobid" field');
  }
  if (typeof data.jobid !== 'number') {
    throw new Error('Job Run data "jobid" field is not a number');
  }
  // jobname
  if (!('jobname' in data)) {
    throw new Error('Job Run data is missing the "jobname" field');
  }
  if (typeof data.jobname !== 'string') {
    throw new Error('Job Run data "jobname" field is not a string');
  }
  // completed (optional)
  // results (optional)
  // ADDITIONAL PROPERTIES
  // urlDetail
  // urlJob
}

export function assertIsJobRuns(data: unknown): asserts data is JobRun[] {
  if (!Array.isArray(data)) {
    throw new Error('Job Runs data is not an array');
  }
  // only checking the first element
  if (data.length > 0) {
    assertIsJobRun(data[0]);
  }
}
