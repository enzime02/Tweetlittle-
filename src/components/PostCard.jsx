// src/components/PostCard.jsx
import { Link } from "react-router-dom";
import { doc, increment, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../contexts/AuthContext";

export default function PostCard({ post }) {
  const { currentUser } = useAuth();

  async function handleLike() {
    try {
      const ref = doc(db, "posts", post.id);
      await updateDoc(ref, { likes: increment(1) });
    } catch (err) {
      console.error("Error liking post", err);
    }
  }

  const createdAt =
    post.createdAt?.toDate?.().toLocaleString() ?? "just now";

  return (
    <article className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-sm flex gap-3">
      {/** Avatar placeholder */}
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-sky-500/20 flex items-center justify-center text-sky-400 font-semibold">
        {post.authorDisplayName?.[0]?.toUpperCase() ?? "U"}
      </div>

      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div>
            <Link
              to={`/profile/${post.authorId}`}
              className="font-semibold text-slate-100 hover:underline"
            >
              {post.authorDisplayName}
            </Link>
            <div className="text-xs text-slate-400">
              {post.authorHandle} · {createdAt}
            </div>
          </div>
        </div>

        <p className="mt-2 text-slate-100 whitespace-pre-wrap">
          {post.text}
        </p>

        {post.imageUrl && (
          <img
            src={post.imageUrl}
            alt="post"
            className="mt-3 rounded-xl border border-slate-800 max-h-80 object-cover"
          />
        )}

        <div className="mt-3 flex items-center gap-4 text-xs text-slate-400">
          <button
            onClick={handleLike}
            className="flex items-center gap-1 hover:text-sky-400"
            disabled={!currentUser}
          >
            <span>❤️</span>
            <span>{post.likes ?? 0}</span>
          </button>
        </div>
      </div>
    </article>
  );
}
