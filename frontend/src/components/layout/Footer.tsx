export default function Footer(): React.JSX.Element {
  return (
    <footer className="p-4 text-center text-sm text-slate-600">
      <span>© 2025 Matthew Plant</span>
      <span> &nbsp;|&nbsp; </span>
      <span>
        Licensed under GPL-3.0-or-later -{" "}
        <a className="underline hover:text-slate-900" href="#/licenses">
          License
        </a>
        {" · "}
        <a className="underline hover:text-slate-900" href="#/licenses/third-party">
          Third-Party Notices
        </a>
      </span>
    </footer>
  );
}
