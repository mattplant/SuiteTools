export type CriteriaFields = {
  startDate?: Date;
  endDate?: Date;
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
  results: {
    startTime: number;
    endTime: number;
    averageConcurrency: number;
    peakConcurrency: number;
  }[];
  hourAverages?: number[]; // added field for average concurrency for each hour of the day (0-23)
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
    violation: { [key: number]: number }; // key is dateMS, value is violation error rate percentage
  };
}
