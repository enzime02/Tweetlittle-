import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../contexts/AuthContext";
import PostCard from "../components/PostCard";

export default function Home() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setPosts(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return unsub;
  }, []);

  function goToMyProfile() {
    if (!currentUser) return;
    navigate("/profile/" + currentUser.uid);
  }

  return (
    <>
      <div
        className="page-header"
        style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
      >
        <h1 className="page-header-title">Home</h1>

        {currentUser && (
          <button
            type="button"
            onClick={goToMyProfile}
            className="btn btn-outline btn-small"
          >
            My profile
          </button>
        )}
      </div>

      <div className="feed-list">
        {posts.map((p) => (
          <PostCard key={p.id} post={p} />
        ))}
      </div>
    </>
  );
}