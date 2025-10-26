import { Button, ButtonGroup } from 'flowbite-react';
import type { User } from '@suiteworks/suitetools-shared';
import { openAppPage, openNetSuitePage } from '../../../utils/navigation';
import { EntityFields, type EntityField } from '../../shared/ui/EntityFields';

type Props = {
  data: User;
  modal?: boolean;
};

/**
 * Pure presentation of a User entity. Expects fully adapted & validated data.
 * @param props - Component props.
 * @param props.data - The user data to display.
 * @param [props.modal] - Whether to display modal actions.
 * @returns The rendered user result component.
 */
export function UserResult({ data, modal = false }: Props): JSX.Element {
  const viewEmployeeRecord: () => void = () => {
    if (data.urlNs) {
      openNetSuitePage(data.urlNs);
    }
  };

  const viewUserDetails: () => void = () => {
    if (data.urlDetail) {
      openAppPage(data.urlDetail);
    }
  };

  const fields: EntityField[] = [
    { label: 'ID', value: data.id },
    { label: 'Name', value: data.name },
    { label: 'Active', value: data.isinactive ? 'No' : 'Yes' },
    { label: 'Email', value: data.email },
    { label: 'Supervisor', value: data.supervisor },
    { label: 'Title', value: data.title },
    { label: 'Last Login', value: data.lastLogin },
    { label: 'Role(s)', value: data.role_names },
  ];

  return (
    <>
      <EntityFields fields={fields} />

      {modal && (
        <ButtonGroup>
          <Button onClick={viewEmployeeRecord}>View Employee Record</Button>
          <Button onClick={viewUserDetails}>View User Details</Button>
        </ButtonGroup>
      )}
    </>
  );
}
