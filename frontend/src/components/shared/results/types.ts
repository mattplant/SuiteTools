/**
 * Minimal shape for modal detail payloads (entity row with numeric id).
 * FE view-layer type — not a shared domain schema.
 */
export type ModalResult = {
  id: number;
};

/**
 * Props for entity results grids that open a detail modal.
 * Kept in the frontend: UI wiring, not a cross-workspace domain contract.
 */
export type ResultsProps = {
  rows: readonly unknown[];
  setId: (id: number) => void;
  setOpenModal: (openModal: boolean) => void;
};

/** String enum keys for {@link resultsMap} / ResultsModal switches. */
export enum ResultsTypes {
  FILE = 'file',
  INTEGRATION = 'integration',
  JOB = 'job',
  JOBRUN = 'jobRun',
  LOGIN = 'login',
  ROLE = 'role',
  SCRIPT = 'script',
  SCRIPTLOG = 'scriptlog',
  SOAPLOG = 'soaplog',
  TOKEN = 'token',
  USER = 'user',
}

export interface SummaryRow {
  id: string;
  totalCount: number;
}
