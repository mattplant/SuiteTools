import {
  Dropdown,
  DropdownDivider,
  DropdownHeader,
  DropdownItem,
  Navbar,
  NavbarBrand,
  NavbarCollapse,
  NavbarLink,
  NavbarToggle,
} from 'flowbite-react';
import { useAppSettingsContext } from './AppSettingsContext';

export default function Header() {
  const { settings } = useAppSettingsContext();

  return (
    <Navbar fluid rounded>
      <NavbarBrand href="#">
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">SuiteTools</span>
      </NavbarBrand>
      <div className="flex md:order-2">
        <Dropdown arrowIcon={false} inline label={settings?.userName}>
          <DropdownHeader>
            <span className="block text-sm">{settings?.userRole}</span>
            <span className="block truncate text-sm font-medium">{settings?.userEmail?.toUpperCase()}</span>
            <span className="block text-sm">Subsidiary: {settings?.userSubsidiary}</span>
            <span className="block text-sm">Location: {settings?.userLocation}</span>
            <span className="block text-sm">Department:{settings?.userDepartment}</span>
          </DropdownHeader>
          <DropdownDivider />
          <DropdownItem>
            <NavbarLink href="#/settings">Settings</NavbarLink>
          </DropdownItem>
        </Dropdown>
        <NavbarToggle />
      </div>
      <NavbarCollapse>
        <Dropdown arrowIcon={false} inline label={settings?.envType}>
          <DropdownHeader>
            <DropdownDivider />
            <span className="block text-sm font-bold">-----------</span>
            <span className="block text-sm font-bold">NetSuite</span>
            <span className="block text-sm font-bold">-----------</span>
            <DropdownDivider />
            <span className="block text-sm">Account Id: {settings?.accountId}</span>
            <span className="block text-sm">Environment: {settings?.envType}</span>
            <span className="block text-sm">Version: {settings?.version}</span>
            <span className="block text-sm">Processors: {settings?.processorCount}</span>
            <span className="block text-sm">Queues: {settings?.queueCount}</span>
            <DropdownDivider />
            <span className="block text-sm font-bold">-----------</span>
            <span className="block text-sm font-bold">SuiteTools</span>
            <span className="block text-sm font-bold">-----------</span>
            <DropdownDivider />
            <span className="block text-sm">app-bundle: {settings?.appBundle}</span>
          </DropdownHeader>
          <DropdownDivider />
          <DropdownItem>
            <NavbarLink href="/app/center/card.nl?sc=-29&whence=" target="_blank">
              Go to NetSuite
            </NavbarLink>
          </DropdownItem>
        </Dropdown>
        <Dropdown arrowIcon={false} inline label="Tools">
          <DropdownItem>
            <NavbarLink href="#/jobs">Jobs</NavbarLink>
          </DropdownItem>
          <DropdownItem>
            <NavbarLink href="#/jobRuns">Job Status</NavbarLink>
          </DropdownItem>
        </Dropdown>
        <Dropdown arrowIcon={false} inline label="Integrations">
          <DropdownItem>
            <NavbarLink href="#/integrations">Integrations</NavbarLink>
          </DropdownItem>
          <DropdownItem>
            <NavbarLink href="#/tokens">Tokens</NavbarLink>
          </DropdownItem>
          <DropdownItem>
            <NavbarLink href="#/users">Users</NavbarLink>
          </DropdownItem>
          <DropdownItem>
            <NavbarLink href="#/roles">Roles</NavbarLink>
          </DropdownItem>
          <DropdownItem>
            <NavbarLink href="#/logins">Logins</NavbarLink>
          </DropdownItem>
          <DropdownItem>
            <NavbarLink href="#/concurrency">Concurrency</NavbarLink>
          </DropdownItem>
        </Dropdown>
        <Dropdown arrowIcon={false} inline label="Logs">
          <DropdownItem>
            <NavbarLink href="#/scriptLogs">Script Logs</NavbarLink>
          </DropdownItem>
          <DropdownItem>
            <NavbarLink href="#/soapLogs">SOAP Logs</NavbarLink>
          </DropdownItem>
        </Dropdown>
        <Dropdown arrowIcon={false} inline label="Objects">
          <DropdownItem>
            <NavbarLink href="#/files">Files</NavbarLink>
          </DropdownItem>
          <DropdownItem>
            <NavbarLink href="#/scripts">Scripts</NavbarLink>
          </DropdownItem>
        </Dropdown>
      </NavbarCollapse>
    </Navbar>
  );
}
