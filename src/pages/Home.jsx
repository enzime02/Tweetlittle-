// src/pages/Home.jsx
import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../contexts/AuthContext";
import PostCard from "../components/PostCard";
import { Link } from "react-router-dom";

export default function Home() {
  const { currentUser } = useAuth();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const q = query(
      collection(db, "posts"),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, (snap) => {
      const list = [];
      snap.forEach((doc) => list.push({ id: doc.id, ...doc.data() }));
      setPosts(list);
    });

    return unsub;
  }, []);

  return (
    <div className="space-y-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 mb-4">
        <h1 className="text-lg font-semibold text-slate-100 mb-1">
          Home feed
        </h1>
        <p className="text-xs text-slate-400">
          See the latest posts from Twittlittle users.{" "}
          <Link to="/new" className="text-sky-400 hover:underline">
            Create a new post
          </Link>
          .
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="text-center text-slate-400 text-sm">
          No posts yet. Be the first to post!
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} currentUser={currentUser} />
          ))}
        </div>
      )}
    </div>
  );
}
