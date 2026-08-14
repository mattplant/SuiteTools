// SPDX-License-Identifier: GPL-3.0-or-later

import { Button } from "flowbite-react";
import { handleError, UnexpectedError } from "@suiteworks/suitetools-shared";
import { initiateJob } from "../../../adapters/api/job";
import type { CriteriaFields } from "../../shared/criteria/types";
import { RecordCriteriaForm } from "../../shared/criteria/RecordCriteriaForm";
import { SearchCriteriaActive } from "../../shared/criteria/SearchCriteriaActive";
import { getAppBaseUrl } from "../../../utils/navigation";
import { useErrorBoundaryTrigger } from "../../../hooks/useErrorBoundaryTrigger";

interface Props {
  defaultCriteria: CriteriaFields;
  setCriteria: (criteria: CriteriaFields) => void;
}

export function RecordCriteria({ setCriteria, defaultCriteria }: Props) {
  const triggerError = useErrorBoundaryTrigger();

  const initiateJobsClick = async () => {
    try {
      const responseData = await initiateJob({ id: 0 });
      if (responseData.status === 200) {
        const redirectToPage = getAppBaseUrl() + `#/jobRuns`;
        window.location.href = redirectToPage;
        return;
      }
      throw new UnexpectedError("initiateJob()", `status ${responseData.status}`, { jobId: 0 });
    } catch (err) {
      handleError(err, { reactTrigger: triggerError });
    }
  };

  return (
    <RecordCriteriaForm
      defaultCriteria={defaultCriteria}
      setCriteria={setCriteria}
      submitLabel="Get Jobs"
      actions={
        <Button
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.preventDefault();
            void initiateJobsClick();
          }}
        >
          Run Jobs
        </Button>
      }
    >
      {({ register }) => <SearchCriteriaActive register={register} />}
    </RecordCriteriaForm>
  );
}
