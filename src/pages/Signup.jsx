// src/pages/Signup.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      await signup(email, password, displayName);
      navigate("/");
    } catch (err) {
      console.error(err);
      setError("Could not create account. Check your data.");
    }
  }

  return (
    <div className="max-w-sm mx-auto mt-10 bg-slate-900 border border-slate-800 rounded-2xl p-6 text-sm">
      <h1 className="text-xl font-semibold mb-4 text-slate-100">
        Create your account
      </h1>

      {error && (
        <div className="mb-3 text-xs text-red-400 bg-red-950/40 border border-red-800 rounded p-2">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-xs mb-1 text-slate-300">
            Display name
          </label>
          <input
            type="text"
            className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-sky-500"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-xs mb-1 text-slate-300">
            Email
          </label>
          <input
            type="email"
            className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-sky-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-xs mb-1 text-slate-300">
            Password
          </label>
          <input
            type="password"
            className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-sky-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full mt-2 rounded-full bg-sky-500 hover:bg-sky-400 py-2 text-sm font-medium text-white"
        >
          Sign up
        </button>
      </form>

      <p className="mt-4 text-xs text-slate-400">
        Already have an account?{" "}
        <Link to="/login" className="text-sky-400 hover:underline">
          Login
        </Link>
      </p>
    </div>
  );
}
