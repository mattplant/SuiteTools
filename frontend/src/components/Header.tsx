import { NavLink, Link } from 'react-router-dom';

type Props = {
  user: undefined | string;
};

export default function Header({ user }: Props) {
  return (
    <header className="flex justify-between items-center border-b-2 border-gray-100 py-6">
      <Link to={`/`}>
        <h2 className="text-xl font-bold">SuiteTools</h2>
      </Link>
      <nav>
        <NavLink
          to={`system`}
          className={({ isActive }) =>
            `no-underline p-1 pb-0.5 border-solid border-b-2 ${isActive ? 'border-black' : 'border-transparent'}`
          }
        >
          System
        </NavLink>
        <NavLink
          to={`settings`}
          className={({ isActive }) =>
            `no-underline p-1 pb-0.5 border-solid border-b-2 ${isActive ? 'border-black' : 'border-transparent'}`
          }
        >
          Settings
        </NavLink>
        <NavLink
          to={`scripts`}
          className={({ isActive }) =>
            `no-underline p-1 pb-0.5 border-solid border-b-2 ${isActive ? 'border-black' : 'border-transparent'}`
          }
        >
          Scripts
        </NavLink>
        <NavLink
          to={`files`}
          className={({ isActive }) =>
            `no-underline p-1 pb-0.5 border-solid border-b-2 ${isActive ? 'border-black' : 'border-transparent'}`
          }
        >
          Files
        </NavLink>
        <NavLink
          to={`scriptLogs`}
          className={({ isActive }) =>
            `no-underline p-1 pb-0.5 border-solid border-b-2 ${isActive ? 'border-black' : 'border-transparent'}`
          }
        >
          Script_Logs
        </NavLink>
        {user && <span className="ml-auto font-bold">{user}</span>}
      </nav>
    </header>
  );
}
