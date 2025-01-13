export type CriteriaFields = {
  startDate: string;
  endDate: string;
};

export interface ConcurrencyDetailRows {
  startTimeMS: number;
  startTime: string;
  endTimeMS: number;
  endTime: string;
  averageConcurrency: number;
  peakConcurrency: number;
  peakConcurrencyTime?: string;
}

export interface ConcurrencyDetailData {
  concurrency: ConcurrencyDetailDataConcurrency;
  violations: ConcurrencyDetailDataViolations;
}

export interface ConcurrencyDetailDataConcurrency {
  overview: {
    pagingStartDateMS: number;
    pagingEndDateMS: number;
    concurrencyLimit: number;
    peakConcurrency: {
      value: number;
      dateMS: number;
    };
  };
  config: {
    startDateMS: number;
    endDateMS: number;
    groupAggMS: number;
    maxConcurrency: number;
  };
  indices: {
    [key: string]: number;
  };
  concurrency: [number, number][];
  results: {
    startTime: number;
    endTime: number;
    averageConcurrency: number;
    peakConcurrency: number;
    peakConcurrencyTime?: string;
  }[];
}

export interface ConcurrencyDetailDataViolations {
  overview: {
    totalRequests: number;
    totalViolations: number;
    topIntegrations: { id: number; name: string; value: number }[];
    integrationName: string;
  };
  config: {
    startDateMS: number;
    endDataMS: number;
    groupAggMS: number;
  };
  indices: {
    [key: string]: number;
  };
  violations: [number, number][];
}
