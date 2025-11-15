// src/pages/NewPost.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage, timestamp } from "../firebase";
import { useAuth } from "../contexts/AuthContext";

export default function NewPost() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [text, setText] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!currentUser) return;
    if (!text.trim() && !imageFile) return;

    setBusy(true);
    setError("");

    try {
      let imageUrl = "";

      if (imageFile) {
        const storageRef = ref(
          storage,
          `posts/${currentUser.uid}/${Date.now()}_${imageFile.name}`
        );
        await uploadBytes(storageRef, imageFile);
        imageUrl = await getDownloadURL(storageRef);
      }

      await addDoc(collection(db, "posts"), {
        text: text.trim(),
        imageUrl,
        authorId: currentUser.uid,
        authorDisplayName:
          currentUser.displayName ||
          currentUser.email?.split("@")[0] ||
          "User",
        authorHandle:
          "@" +
          (currentUser.displayName ||
            currentUser.email?.split("@")[0] ||
            "user"
          ).toLowerCase(),
        createdAt: timestamp(),
        likes: 0,
      });

      setText("");
      setImageFile(null);
      navigate("/");
    } catch (err) {
      console.error(err);
      setError("Could not create post.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-5 text-sm">
      <h1 className="text-lg font-semibold text-slate-100 mb-3">
        Create a new post
      </h1>

      {error && (
        <div className="mb-3 text-xs text-red-400 bg-red-950/40 border border-red-800 rounded p-2">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <textarea
            className="w-full min-h-[120px] rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-sky-500"
            placeholder="What's happening?"
            maxLength={280}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <div className="mt-1 text-[11px] text-slate-500 text-right">
            {text.length}/280
          </div>
        </div>

        <div>
          <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
            <span className="px-2 py-1 rounded-full bg-slate-800 border border-slate-700">
              Upload image
            </span>
            <span className="text-slate-500">
              {imageFile?.name ?? "Optional"}
            </span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
            />
          </label>
        </div>

        <button
          type="submit"
          disabled={busy}
          className="rounded-full bg-sky-500 hover:bg-sky-400 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
        >
          {busy ? "Posting..." : "Post"}
        </button>
      </form>
    </div>
  );
}
