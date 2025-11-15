// src/pages/Login.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      console.error(err);
      setError("Could not log in. Check your credentials.");
    }
  }

  return (
    <div className="max-w-sm mx-auto mt-10 bg-slate-900 border border-slate-800 rounded-2xl p-6 text-sm">
      <h1 className="text-xl font-semibold mb-4 text-slate-100">
        Login to Twittlittle
      </h1>

      {error && (
        <div className="mb-3 text-xs text-red-400 bg-red-950/40 border border-red-800 rounded p-2">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
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
          Login
        </button>
      </form>

      <p className="mt-4 text-xs text-slate-400">
        New here?{" "}
        <Link to="/signup" className="text-sky-400 hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}
