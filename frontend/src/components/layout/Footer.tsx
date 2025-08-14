export default function Footer(): JSX.Element {
  return (
    <footer style={{ padding: '1rem', textAlign: 'center', fontSize: '0.9rem', color: '#555' }}>
      <span>© {new Date().getFullYear()} Matthew Plant</span>
      <span> &nbsp;|&nbsp; </span>
      <span>
        Licensed under the GNU GPL v3.0 - <a href="#/licenses">View Licenses</a>
      </span>
    </footer>
  );
}
