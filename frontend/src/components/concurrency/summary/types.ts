export type CriteriaFields = {
  dateRange?: string;
};

export interface ConcurrencySummaryData {
  concurrency: ConcurrencySummaryDataConcurrency;
  violations: ConcurrencySummaryDataViolations;
}

export interface ConcurrencySummaryDataConcurrency {
  overview: {
    concurrencyLimit: number;
    peakConcurrency: {
      value: number;
      dateMS: number;
    };
    timeCloseToLimit: {
      value: string;
      lowerRange: number;
      upperRange: number;
    };
    timeOverLimit: {
      value: string;
      range: number;
    };
  };
  config: {
    concurrencyLimit: number;
    endDateFilterMS: number;
    refreshDate: number;
    resolutionMS: number;
    startDateFilterMS: number;
  };
  xCategories: number[];
  yCategories: number[];
  series: {
    average: [number, number, number, number][];
    peak: [number, number, number, number][];
  };
  allocations: object;
  results: [
    {
      startTime: number;
      endTime: number;
      averageConcurrency: number;
      peakConcurrency: number;
    },
  ];
}

export interface ConcurrencySummaryDataViolations {
  mode: string;
  integrations: [];
  overview: {
    totalViolations: number;
    totalRequests: number;
  };
  config: {
    resolutionMS: number;
  };
  series: {
    violation: object;
  };
}
