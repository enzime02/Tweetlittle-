// src/pages/MyPosts.jsx
import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../contexts/AuthContext";
import PostCard from "../components/PostCard";

export default function MyPosts() {
  const { currentUser } = useAuth();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (!currentUser) return;

    const q = query(
      collection(db, "posts"),
      where("authorId", "==", currentUser.uid),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, (snap) => {
      const list = [];
      snap.forEach((doc) => list.push({ id: doc.id, ...doc.data() }));
      setPosts(list);
    });

    return unsub;
  }, [currentUser]);

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold text-slate-100">
        My posts
      </h1>

      {posts.length === 0 ? (
        <div className="text-sm text-slate-400">
          You haven't posted anything yet.
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
