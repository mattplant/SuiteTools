// SPDX-License-Identifier: GPL-3.0-or-later

import { Button, ButtonGroup } from "flowbite-react";
import type { File } from "@suiteworks/suitetools-shared";
import { openAppPage, openNetSuitePage } from "../../../utils/navigation";
import { EntityFields, type EntityField } from "../../shared/ui/EntityFields";

type Props = { data: File; modal?: boolean };

/**
 * Pure presentation of a File entity. Expects fully adapted & validated data.
 * @param props - Component props.
 * @param props.data - The file data to display.
 * @param [props.modal] - Whether to display modal actions.
 * @returns The rendered file result component.
 */
export function FileResult({ data, modal }: Props): React.JSX.Element {
  const fields: EntityField[] = [
    { label: "ID", value: data.id },
    { label: "Folder", value: data.folder },
    { label: "Created Date", value: data.dateCreated.toLocaleString() },
    { label: "Last Modified Date", value: data.lastModifiedDate.toLocaleString() },
    { label: "Type", value: data.fileTypeName },
    { label: "Name", value: data.name },
    { label: "File Size", value: data.fileSize },
    { label: "Description", value: data.description },
    { label: "URL", value: data.url },
  ];

  return (
    <>
      <EntityFields fields={fields} />
      {modal && (
        <ButtonGroup>
          <Button onClick={() => data.urlNs && openNetSuitePage(data.urlNs)}>View File Record</Button>
          <Button onClick={() => data.urlDetail && openAppPage(data.urlDetail)}>View File Details</Button>
        </ButtonGroup>
      )}
    </>
  );
}
