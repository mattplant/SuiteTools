// ---------------------------------------------------------------------------------------------
// Alternate Header using MegaMenu from Flowbite
//
// This implementation is cleaner than using the dropdown component, but does not have the
//   option to dismissOnClick so I can not find a way to close the dropdown after clicking a
//   link which is required for a SPA application.
//
// Try using "data-dropdown-toggle" and "data-collapse-toggle" from https://github.com/themesberg/flowbite/issues/558
// I could also hide a div child element of MegaMenuDropdown, but would then need to change the
//   style to hide it completely
// ---------------------------------------------------------------------------------------------
import { NavLink } from 'react-router-dom';

import { MegaMenu, MegaMenuDropdown, NavbarBrand, NavbarCollapse, NavbarLink } from 'flowbite-react';

type Props = {
  user: undefined | string;
};

const handleItemClick = () => {
  alert('Item clicked');
};

export default function Header({ user }: Props) {
  return (
    <MegaMenu>
      <NavbarBrand href="https://github.com/mattplant/SuiteTools">
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">SuiteTools</span>
      </NavbarBrand>
      {user && (
        <div className="order-2 hidden items-center md:flex">
          <span className="ml-auto font-bold">{user}</span>
        </div>
      )}
      {/* <NavbarToggle /> */}
      <NavbarCollapse>
        <NavbarLink>
          <MegaMenuDropdown toggle={<>Tools</>} id="toolsDropdown">
            <ul className="grid grid-cols-1">
              <div className="space-y-4 p-4">
                <li>
                  <NavLink
                    to={`system`}
                    onClick={() => {
                      document.getElementById('toolsDropdown')?.click();
                      handleItemClick();
                      document.getElementById('toolsDropdown')!.style.display = 'none'; // Hide the dropdown
                    }}
                  >
                    System
                  </NavLink>
                </li>
              </div>
            </ul>
          </MegaMenuDropdown>
        </NavbarLink>
        <NavbarLink>
          <MegaMenuDropdown toggle={<>Objects</>}>
            <ul className="grid grid-cols-1">
              <div className="space-y-4 p-4">
                <li>
                  <NavLink to={`files`}>Files</NavLink>
                </li>
                <li>
                  <NavLink to={`scripts`}>Scripts</NavLink>
                </li>
              </div>
            </ul>
          </MegaMenuDropdown>
        </NavbarLink>
        <NavbarLink>
          <MegaMenuDropdown toggle={<>Entities</>}>
            <ul className="grid grid-cols-1">
              <div className="space-y-4 p-4">
                <li>
                  <NavLink to={`users`}>Users</NavLink>
                </li>
              </div>
            </ul>
          </MegaMenuDropdown>
        </NavbarLink>
        <NavbarLink>
          <MegaMenuDropdown toggle={<>Logs</>}>
            <ul className="grid grid-cols-1">
              <div className="space-y-4 p-4">
                <li>
                  <NavLink to={`users`}>Script Logs</NavLink>
                </li>
              </div>
            </ul>
          </MegaMenuDropdown>
        </NavbarLink>
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
    </MegaMenu>
  );
}

{
  /* <NavbarLink>
            <Dropdown color="light" label="Tools" dismissOnClick={true}>
              <DropdownHeader>
                <span className="block text-sm ">Tools and Views</span>
              </DropdownHeader>
              <Dropdown.Item>
                <NavLink
                  to={`system`}
                  className={({ isActive }) =>
                    `no-underline p-1 pb-0.5 border-solid border-b-2 ${isActive ? 'border-black' : 'border-transparent'}`
                  }
                >
                  System
                </NavLink>
              </Dropdown.Item>
              <Dropdown.Item>
                <NavLink
                  to={`settings`}
                  className={({ isActive }) =>
                    `no-underline p-1 pb-0.5 border-solid border-b-2 ${isActive ? 'border-black' : 'border-transparent'}`
                  }
                >
                  Settings
                </NavLink>
              </Dropdown.Item>
            </Dropdown>
          </NavbarLink>
          <NavbarLink>
            <Dropdown color="light" label="Objects" dismissOnClick={true}>
              <DropdownHeader>
                <span className="block text-sm">NetSuite Objects</span>
              </DropdownHeader>
              <Dropdown.Item>
                <NavLink
                  to={`files`}
                  className={({ isActive }) =>
                    `no-underline p-1 pb-0.5 border-solid border-b-2 ${isActive ? 'border-black' : 'border-transparent'}`
                  }
                >
                  Files
                </NavLink>
              </Dropdown.Item>
              <Dropdown.Item>
                <NavLink
                  to={`scripts`}
                  className={({ isActive }) =>
                    `no-underline p-1 pb-0.5 border-solid border-b-2 ${isActive ? 'border-black' : 'border-transparent'}`
                  }
                >
                  Scripts
                </NavLink>
              </Dropdown.Item>
            </Dropdown>
          </NavbarLink>
          <NavbarLink>
            <Dropdown color="light" label="Entities" dismissOnClick={true}>
              <DropdownHeader>
                <span className="block text-sm">NetSuite Entities</span>
              </DropdownHeader>
              <Dropdown.Item>
                <NavLink
                  to={`users`}
                  className={({ isActive }) =>
                    `no-underline p-1 pb-0.5 border-solid border-b-2 ${isActive ? 'border-black' : 'border-transparent'}`
                  }
                >
                  Users
                </NavLink>
              </Dropdown.Item>
            </Dropdown>
          </NavbarLink>
          <NavbarLink>
            <Dropdown color="light" label="Logs" dismissOnClick={true}>
              <DropdownHeader>
                <span className="block text-sm">NetSuite Logs</span>
              </DropdownHeader>
              <Dropdown.Item>
                <NavLink
                  to={`scriptLogs`}
                  className={({ isActive }) =>
                    `no-underline p-1 pb-0.5 border-solid border-b-2 ${isActive ? 'border-black' : 'border-transparent'}`
                  }
                >
                  Script Logs
                </NavLink>
              </Dropdown.Item>
            </Dropdown>
          </NavbarLink>
        </NavbarCollapse>
      </Navbar> */
}
