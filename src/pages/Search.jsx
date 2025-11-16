import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";
import { db } from "../firebase";

export default function Search() {
  const [allUsers, setAllUsers] = useState([]);
  const [queryText, setQueryText] = useState("");

  useEffect(() => {
    getDocs(collection(db, "users")).then((snap) => {
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setAllUsers(list);
    });
  }, []);

  const filteredUsers = allUsers.filter((u) => {
    const t = queryText.toLowerCase();
    const name = (u.displayName || "").toLowerCase();
    const handle = (u.handle || "").toLowerCase();
    const email = (u.email || "").toLowerCase();

    return (
      name.includes(t) ||
      handle.includes(t) ||
      email.includes(t)
    );
  });

  return (
    <>
      <div className="page-header">
        <h1 className="page-header-title">Search</h1>
      </div>

      <div className="search-wrapper">
        <input
          className="search-input"
          placeholder="Search users"
          value={queryText}
          onChange={(e) => setQueryText(e.target.value)}
        />

        <div className="search-results">
          {filteredUsers.map((u) => (
            <Link
              key={u.id}
              to={"/profile/" + u.id}
              className="search-user-row"
            >
              <div className="post-avatar-initial">
                {(u.displayName && u.displayName[0].toUpperCase()) || "U"}
              </div>
              <div>
                <div className="search-user-name">
                  {u.displayName || "User"}
                </div>
                <div className="search-user-handle">
                  @{u.handle || "handle"}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}