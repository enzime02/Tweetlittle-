// src/components/PostCard.jsx
import { Link } from "react-router-dom";
import { doc, increment, updateDoc } from "firebase/firestore";
import { useState } from "react";
import { db } from "../firebase";
import { useAuth } from "../contexts/AuthContext";

export default function PostCard({ post }) {
  const { currentUser } = useAuth();
  const [showImageModal, setShowImageModal] = useState(false);

  const name = post.authorDisplayName || "Unknown user";
  const handleRaw = post.authorHandle || "";
  const handle = handleRaw.replace(/^@/, ""); // por si quedó con @
  const initial = name.trim()[0]?.toUpperCase() || "?";

  const createdAt =
    post.createdAt?.toDate?.().toLocaleString() ?? "just now";

  async function handleLike() {
    if (!currentUser) return;
    try {
      const ref = doc(db, "posts", post.id);
      await updateDoc(ref, { likes: increment(1) });
    } catch (err) {
      console.error("Error liking post", err);
    }
  }

  return (
    <>
      <article className="post-card">
        <div className="post-wrapper">
          {/* Avatar */}
          <div className="post-avatar">
            <div className="post-avatar-initial">{initial}</div>
          </div>

          {/* Contenido */}
          <div className="post-content">
            <header className="post-header">
              <div className="post-name">
                <Link
                  to={`/profile/${post.authorId}`}
                  className="post-name"
                >
                  {name}
                </Link>
                {handle && (
                  <span className="post-handle">@{handle}</span>
                )}
                <span className="post-dot">·</span>
                <span className="post-timestamp">{createdAt}</span>
              </div>
            </header>

            {/* Texto */}
            {post.text && (
              <p className="post-text">
                {post.text}
              </p>
            )}

            {/* Imagen */}
            {post.imageUrl && (
              <div
                className="post-image-wrapper"
                onClick={() => setShowImageModal(true)}
              >
                <img src={post.imageUrl} alt="" className="post-image" />
              </div>
            )}

            {/* Footer: likes */}
            <footer className="post-actions">
              <button
                type="button"
                onClick={handleLike}
                disabled={!currentUser}
                className="btn-like"
              >
                <span>❤️</span>
                <span>{post.likes ?? 0}</span>
              </button>
            </footer>
          </div>
        </div>
      </article>

      {/* Modal imagen grande */}
      {showImageModal && post.imageUrl && (
        <div
          className="image-modal-backdrop"
          onClick={() => setShowImageModal(false)}
        >
          <div
            className="image-modal-inner"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={post.imageUrl}
              alt=""
              className="image-modal-img"
            />
          </div>
        </div>
      )}
    </>
  );
}
