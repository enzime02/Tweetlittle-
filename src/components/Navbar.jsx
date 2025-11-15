// src/components/Navbar.jsx
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await logout();
      navigate("/login");
    } catch (err) {
      console.error("Logout error", err);
    }
  }

  return (
    <header className="fixed top-0 inset-x-0 bg-slate-950/80 backdrop-blur border-b border-slate-800 z-20">
      <nav className="max-w-4xl mx-auto flex items-center justify-between px-4 py-3 text-sm">
        <Link to="/" className="font-semibold text-sky-400">
          Twittlittle
        </Link>

        {currentUser ? (
          <div className="flex items-center gap-3">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `px-2 py-1 rounded ${
                  isActive ? "text-sky-400" : "text-slate-300"
                }`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/new"
              className={({ isActive }) =>
                `px-2 py-1 rounded ${
                  isActive ? "text-sky-400" : "text-slate-300"
                }`
              }
            >
              New post
            </NavLink>
            <NavLink
              to="/search"
              className={({ isActive }) =>
                `px-2 py-1 rounded ${
                  isActive ? "text-sky-400" : "text-slate-300"
                }`
              }
            >
              Search
            </NavLink>
            <NavLink
              to="/myposts"
              className={({ isActive }) =>
                `px-2 py-1 rounded ${
                  isActive ? "text-sky-400" : "text-slate-300"
                }`
              }
            >
              My posts
            </NavLink>
            <NavLink
              to={`/profile/${currentUser.uid}`}
              className={({ isActive }) =>
                `px-2 py-1 rounded ${
                  isActive ? "text-sky-400" : "text-slate-300"
                }`
              }
            >
              Profile
            </NavLink>
            <button
              onClick={handleLogout}
              className="ml-2 rounded-full bg-slate-800 hover:bg-slate-700 px-3 py-1 text-xs text-slate-100"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3 text-slate-300">
            <Link to="/login" className="hover:text-sky-400">
              Login
            </Link>
            <Link
              to="/signup"
              className="rounded-full bg-sky-500 hover:bg-sky-400 px-3 py-1 text-xs text-white"
            >
              Sign up
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
