import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="navbar">
      <nav className="navbar-inner">
        <div className="navbar-left">
          <Link to="/" className="navbar-left">
            <div className="navbar-logo-circle">t</div>
            <span className="navbar-logo-text">Twittlittle</span>
          </Link>
        </div>

        <div className="navbar-links">
          <Link to="/" className="navbar-link">
            Home
          </Link>

          <Link to="/new" className="navbar-link">
            Post
          </Link>

          <Link to="/search" className="navbar-link">
            Search
          </Link>
        </div>
      </nav>
    </header>
  );
}