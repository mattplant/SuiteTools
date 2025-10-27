import { Button, ButtonGroup } from 'flowbite-react';
import type { ScriptLog } from '@suiteworks/suitetools-shared';
import { openAppPage, openNetSuitePage } from '../../../utils/navigation';
import { EntityFields, type EntityField } from '../../shared/ui/EntityFields';

type Props = {
  data: ScriptLog;
  modal?: boolean;
};

/**
 * Pure presentation of a ScriptLog entity. Expects fully adapted & validated data.
 * @param props - Component props.
 * @param props.data - The script log data to display.
 * @param [props.modal] - Whether to display modal actions.
 * @returns The rendered script log result component.
 */
export function ScriptLogResult({ data, modal }: Props): JSX.Element {
  const fields: EntityField[] = [
    { label: 'ID', value: data.id },
    { label: 'Timestamp', value: data.timestamp },
    { label: 'Type', value: data.type },
    { label: 'Script Type', value: data.scripttype },
    { label: 'Owner', value: data.owner },
    { label: 'Name', value: data.scriptname },
    { label: 'Title', value: data.title },
    { label: 'Detail', value: data.detail },
  ];

  // TODO: is this used? If not remove.
  if (!modal) {
    return <EntityFields fields={fields} />;
  }

  return (
    <>
      <EntityFields fields={fields} />
      {modal && (
        <ButtonGroup>
          <Button onClick={() => data.urlNs && openNetSuitePage(data.urlNs)}>View Script Log Record</Button>
          <Button onClick={() => data.urlDetail && openAppPage(data.urlDetail)}>View Script Log Details</Button>
        </ButtonGroup>
      )}
    </>
  );
}
