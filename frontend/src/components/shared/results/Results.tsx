// SPDX-License-Identifier: GPL-3.0-or-later

import { useEffect, useState } from "react";
import { Modal } from "flowbite-react";
import { useLocation } from "react-router-dom";
import { DynamicResultsRenderer } from "./DynamicResultsRenderer";
import type { NotFound } from "@suiteworks/suitetools-shared";
import { handleError, isNotFound, NotFoundError } from "@suiteworks/suitetools-shared";
import { ResultsTypes } from "./types";
import type { ModalResult } from "./types";
import { ResultsModal } from "./ResultsModal";
import { useErrorBoundaryTrigger } from "../../../hooks/useErrorBoundaryTrigger";

type Props = {
  type: ResultsTypes;
  lines: readonly unknown[];
  getModalData: (id: number, lines?: readonly unknown[]) => Promise<ModalResult | NotFound>;
};

/**
 * Renders the results table and modal for the given type and data.
 * @param root0 - The props object.
 * @param root0.type - The type of results to render (e.g. role, user, job).
 * @param root0.lines - The data rows to display in the results table.
 * @param root0.getModalData - Async function to fetch modal data for a given record id.
 * @returns The rendered Results component.
 */
export function Results({ type, lines, getModalData }: Props): React.JSX.Element {
  const location = useLocation();
  const triggerError = useErrorBoundaryTrigger();
  const [openModal, setOpenModal] = useState(false);
  const [id, setId] = useState<number | null>(null);
  const [data, setData] = useState<ModalResult>();
  const [loading, setLoading] = useState(false);

  // determine modal title based on modal type
  const modalTitles: Record<ResultsTypes, string> = {
    [ResultsTypes.FILE]: "File",
    [ResultsTypes.INTEGRATION]: "Integration",
    [ResultsTypes.JOB]: "Job",
    [ResultsTypes.JOBRUN]: "Job Execution",
    [ResultsTypes.LOGIN]: "Login",
    [ResultsTypes.ROLE]: "Role",
    [ResultsTypes.SCRIPT]: "Script",
    [ResultsTypes.SCRIPTLOG]: "Script Log Details",
    [ResultsTypes.SOAPLOG]: "SOAP Log Details",
    [ResultsTypes.TOKEN]: "Token",
    [ResultsTypes.USER]: "User",
  };

  const modalTitle = modalTitles[type] ?? "Unknown";

  useEffect(() => {
    if (id === null) return; // skip since no record selected

    let ignore = false;
    setLoading(true);
    const selectedId = id;

    async function fetchData(): Promise<void> {
      try {
        const result = await getModalData(selectedId, lines);
        if (isNotFound(result)) {
          throw new NotFoundError(modalTitle, selectedId);
        }
        if (!ignore && "id" in result) {
          setData(result);
        }
      } catch (error) {
        if (!ignore) {
          setData(undefined);
        }
        handleError(error, { reactTrigger: triggerError });
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }
    fetchData();

    return (): void => {
      ignore = true;
    };
  }, [id, lines, getModalData, modalTitle, triggerError]);

  // Close the modal on any in-app navigation performed from inside it.
  //
  // Keyed on `location.key`, not `location.pathname`. A modal can be hosted on the very route one
  // of its buttons targets — the Job Executions list lives on `/job/:id`, and its "Job Details"
  // button navigates to `/job/:id`. That pushes a new history entry without changing the path, so
  // a pathname-keyed effect never fired and the modal stayed open over the page the user asked
  // for, making the click look dead (#88). React Router issues a fresh `key` per history entry,
  // including same-path pushes and back/forward, so this covers both cases.
  //
  // The suppression below is permanent by design, not deferred work: `location.key` is reported
  // as unnecessary because the body only calls setters. It is the trigger, and the rule has no
  // way to say so.
  // biome-ignore lint/correctness/useExhaustiveDependencies: location.key is the trigger for this effect, not a value it reads
  useEffect(() => {
    setOpenModal(false);
    setId(null);
    setData(undefined);
  }, [location.key]);

  return (
    <div>
      <DynamicResultsRenderer type={type} rows={lines} setId={setId} setOpenModal={setOpenModal} />
      <Modal
        dismissible
        show={openModal}
        size="6xl"
        onClose={() => {
          setOpenModal(false);
          setId(null);
          setData(undefined);
        }}
      >
        <div className="px-6 pt-6 text-2xl font-semibold">{modalTitle}</div>
        <div className="space-y-6 p-6">
          {loading ? <div>Loading...</div> : <ResultsModal type={type} loading={loading} data={data} />}
        </div>
      </Modal>
    </div>
  );
}
