import {
  Dropdown,
  DropdownHeader,
  Navbar,
  NavbarBrand,
  NavbarCollapse,
  NavbarLink,
  NavbarToggle,
} from 'flowbite-react';
import { NavLink } from 'react-router-dom';
import { useAppSettingsContext } from './AppSettingsContext';

export default function Header() {
  const { settings } = useAppSettingsContext();

  return (
    <Navbar fluid rounded>
      <NavbarBrand href="#">
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">SuiteTools</span>
      </NavbarBrand>
      <NavbarToggle />
      <NavbarCollapse>
        <NavbarLink>
          <Dropdown color="light" label={settings?.envType} dismissOnClick={true}>
            <p>----------</p>
            <a
              href={'/app/center/card.nl?sc=-29&whence='}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              NetSuite
            </a>
            <p>----------</p>
            <p>Environment Type: {settings?.envType}</p>
            <p>Account Id: {settings?.accountId}</p>
            <p>Version: {settings?.version}</p>
            <p>Processors: {settings?.processorCount}</p>
            <p>Queues: {settings?.queueCount}</p>
            <p>----------</p>
            <p>SuiteTools</p>
            <p>----------</p>
            <p>app-bundle: {settings?.appBundle}</p>
          </Dropdown>
        </NavbarLink>
        <NavbarLink>
          <Dropdown color="light" label="Tools" dismissOnClick={true}>
            <Dropdown.Item>
              <NavLink to={`jobs`}>Jobs</NavLink>
            </Dropdown.Item>
            <Dropdown.Item>
              <NavLink to={`jobRuns`}>Job Status</NavLink>
            </Dropdown.Item>
          </Dropdown>
        </NavbarLink>
        <NavbarLink>
          <Dropdown color="light" label="Integrations" dismissOnClick={true}>
            <Dropdown.Item>
              <NavLink to={`integrations`}>Integrations</NavLink>
            </Dropdown.Item>
            <Dropdown.Item>
              <NavLink to={`tokens`}>Tokens</NavLink>
            </Dropdown.Item>
            <Dropdown.Item>
              <NavLink to={`users`}>Users</NavLink>
            </Dropdown.Item>
            <Dropdown.Item>
              <NavLink to={`roles`}>Roles</NavLink>
            </Dropdown.Item>
            <Dropdown.Item>
              <NavLink to={`logins`}>Logins</NavLink>
            </Dropdown.Item>
            <Dropdown.Item>
              <NavLink to={`concurrency`}>Concurrency</NavLink>
            </Dropdown.Item>
          </Dropdown>
        </NavbarLink>
        <NavbarLink>
          <Dropdown color="light" label="Logs" dismissOnClick={true}>
            <Dropdown.Item>
              <NavLink to={`scriptLogs`}>Script Logs</NavLink>
            </Dropdown.Item>
            <Dropdown.Item>
              <NavLink to={`soapLogs`}>SOAP Logs</NavLink>
            </Dropdown.Item>
          </Dropdown>
        </NavbarLink>
        <NavbarLink>
          <Dropdown color="light" label="Objects" dismissOnClick={true}>
            <Dropdown.Item>
              <NavLink to={`files`}>Files</NavLink>
            </Dropdown.Item>
            <Dropdown.Item>
              <NavLink to={`scripts`}>Scripts</NavLink>
            </Dropdown.Item>
          </Dropdown>
        </NavbarLink>
        {settings?.userName && (
          <Dropdown color="light" label={settings?.userName} dismissOnClick={true}>
            <DropdownHeader>
              <p>
                <b>{settings?.userRole.toUpperCase()}</b>
              </p>
              <NavLink to={`user/` + settings.userId}>{settings?.userEmail}</NavLink>
              <p>Subsidiary: {settings?.userSubsidiary}</p>
              <p>Location: {settings?.userLocation}</p>
              <p>Department: {settings?.userDepartment}</p>
            </DropdownHeader>
            <Dropdown.Item>
              <NavLink to={`settings`}>Settings</NavLink>
            </Dropdown.Item>
          </Dropdown>
        )}
      </NavbarCollapse>
    </Navbar>
  );
}
