// src/pages/Search.jsx
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";
import { db } from "../firebase";

export default function Search() {
  const [term, setTerm] = useState("");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function loadUsers() {
      const snap = await getDocs(collection(db, "users"));
      const list = [];
      snap.forEach((doc) => list.push({ id: doc.id, ...doc.data() }));
      setUsers(list);
    }
    loadUsers();
  }, []);

  const filtered = users.filter((u) => {
    const t = term.toLowerCase();
    return (
      u.displayName?.toLowerCase().includes(t) ||
      u.handle?.toLowerCase().includes(t)
    );
  });

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold text-slate-100">
        Search users
      </h1>

      <input
        type="text"
        placeholder="Search by name or handle"
        className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-sky-500"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
      />

      <div className="space-y-2 text-sm">
        {filtered.length === 0 ? (
          <div className="text-slate-400">No users found.</div>
        ) : (
          filtered.map((u) => (
            <Link
              key={u.id}
              to={`/profile/${u.id}`}
              className="flex items-center justify-between bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 hover:border-sky-500"
            >
              <div>
                <div className="font-semibold text-slate-100">
                  {u.displayName}
                </div>
                <div className="text-xs text-slate-400">{u.handle}</div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
