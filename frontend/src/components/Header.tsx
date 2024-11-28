// TODO: replace NavLink with NavbarLink
import { NavLink } from 'react-router-dom';

import { Dropdown, Navbar, NavbarBrand, NavbarCollapse, NavbarLink, NavbarToggle } from 'flowbite-react';

type Props = {
  user: undefined | string;
};

export default function Header({ user }: Props) {
  return (
    <Navbar fluid rounded>
      <NavbarBrand href="https://github.com/mattplant/SuiteTools">
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">SuiteTools</span>
      </NavbarBrand>
      <NavbarToggle />
      <NavbarCollapse>
        <NavbarLink>
          <Dropdown color="light" label="Tools" dismissOnClick={true}>
            <Dropdown.Item>
              <NavLink to={`system`}>System</NavLink>
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
        <NavbarLink>
          <Dropdown color="light" label="Entities" dismissOnClick={true}>
            <Dropdown.Item>
              <NavLink to={`users`}>Users</NavLink>
            </Dropdown.Item>
          </Dropdown>
        </NavbarLink>
        <NavbarLink>
          <Dropdown color="light" label="Logs" dismissOnClick={true}>
            <Dropdown.Item>
              <NavLink to={`scriptLogs`}>Script Logs</NavLink>
            </Dropdown.Item>
          </Dropdown>
        </NavbarLink>
        {user && (
          <NavbarLink>
            <span className="ml-auto font-bold">{user}</span>
          </NavbarLink>
        )}
        <NavbarLink>
          <NavLink
            to={`settings`}
            className={({ isActive }) =>
              `no-underline p-1 pb-0.5 border-solid border-b-2 ${isActive ? 'border-black' : 'border-transparent'}`
            }
          >
            Settings
          </NavLink>
        </NavbarLink>
      </NavbarCollapse>
    </Navbar>
  );
}
