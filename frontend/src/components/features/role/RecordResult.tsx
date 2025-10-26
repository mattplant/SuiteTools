// SPDX-License-Identifier: GPL-3.0-or-later

import { Button, ButtonGroup } from 'flowbite-react';
import type { Role } from '@suiteworks/suitetools-shared';
import { openAppPage, openNetSuitePage } from '../../../utils/navigation';

type Props = {
  data: Role;
  modal?: boolean;
};

export function RoleResult({ data, modal }: Props) {
  return (
    <>
      <p>
        <b>ID</b>: {data.id}
      </p>
      <p>
        <b>Name</b>: {data.name}
      </p>
      <p>
        <b>Active</b>: {data.isinactive ? 'No' : 'Yes'}
      </p>
      <p>
        <b>Center Type</b>: {data.centertype}
      </p>
      <p>
        <b>Sales Role</b>: {data.issalesrole ? 'Yes' : 'No'}
      </p>
      <p>
        <b>Support Role</b>: {data.issupportrole ? 'Yes' : 'No'}
      </p>
      <p>
        <b>Web Service Only</b>: {data.iswebserviceonlyrole ? 'Yes' : 'No'}
      </p>
      {modal && (
        <ButtonGroup>
          <Button onClick={() => data.urlNs && openNetSuitePage(data.urlNs)}>View Role Record</Button>
          <Button onClick={() => data.urlDetail && openAppPage(data.urlDetail)}>View Role Details</Button>
        </ButtonGroup>
      )}
    </>
  );
}
