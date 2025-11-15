// src/pages/Profile.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../contexts/AuthContext";
import FollowButton from "../components/FollowButton";
import PostCard from "../components/PostCard";

export default function Profile() {
  const { uid } = useParams();
  const { currentUser } = useAuth();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function loadUser() {
      const ref = doc(db, "users", uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setUser({ id: snap.id, ...snap.data() });
      } else {
        setUser(null);
      }
    }

    async function loadPosts() {
      const q = query(
        collection(db, "posts"),
        where("authorId", "==", uid),
        orderBy("createdAt", "desc")
      );
      const snap = await getDocs(q);
      const list = [];
      snap.forEach((doc) => list.push({ id: doc.id, ...doc.data() }));
      setPosts(list);
    }

    loadUser();
    loadPosts();
  }, [uid]);

  if (!user) {
    return (
      <div className="text-sm text-slate-400">
        User not found.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-start gap-4">
        <div className="w-14 h-14 rounded-full bg-sky-500/20 flex items-center justify-center text-sky-400 text-xl font-semibold">
          {user.displayName?.[0]?.toUpperCase() ?? "U"}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-lg font-semibold text-slate-100">
                {user.displayName}
              </div>
              <div className="text-xs text-slate-400">{user.handle}</div>
            </div>
            <FollowButton targetUid={uid} />
          </div>
          {user.bio && (
            <p className="mt-2 text-sm text-slate-200">{user.bio}</p>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-slate-200">
          Posts
        </h2>
        {posts.length === 0 ? (
          <div className="text-xs text-slate-400">
            This user hasn't posted anything yet.
          </div>
        ) : (
          posts.map((post) => <PostCard key={post.id} post={post} />)
        )}
      </div>
    </div>
  );
}
