import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../firebase";
import { useAuth } from "../contexts/AuthContext";

export default function NewPost() {
  const { currentUser } = useAuth();
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!currentUser) {
      setError("You must be logged in.");
      return;
    }
    if (!text.trim() && !file) {
      setError("Write something or attach an image.");
      return;
    }

    setSending(true);
    try {
      let imageUrl = null;

      if (file) {
        const fileName = Date.now() + "-" + file.name;
        const imageRef = ref(
          storage,
          "posts/" + currentUser.uid + "/" + fileName
        );
        await uploadBytes(imageRef, file);
        imageUrl = await getDownloadURL(imageRef);
      }

      await addDoc(collection(db, "posts"), {
        text: text,
        imageUrl: imageUrl,
        userId: currentUser.uid,
        displayName: currentUser.displayName || "User",
        handle: currentUser.email.split("@")[0],
        likes: 0,
        createdAt: serverTimestamp(),
      });

      setText("");
      setFile(null);
    } catch (err) {
      console.error(err);
      setError("Could not post. Try again.");
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      <div className="page-header">
        <h1 className="page-header-title">New Post</h1>
      </div>

      <div className="newpost-wrapper">
        <form onSubmit={handleSubmit}>
          {error && (
            <div
              style={{
                marginBottom: "8px",
                fontSize: "13px",
                color: "#fecaca",
              }}
            >
              {error}
            </div>
          )}

          <label
            style={{
              display: "block",
              marginBottom: "6px",
              fontSize: "13px",
              color: "#9ca3af",
            }}
          >
            Text
          </label>
          <textarea
            className="textarea"
            placeholder="What's happening?"
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={280}
          />

          <label
            style={{
              display: "block",
              marginTop: "10px",
              marginBottom: "6px",
              fontSize: "13px",
              color: "#9ca3af",
            }}
          >
            Image (optional)
          </label>
          <input
            type="file"
            accept="image/*"
            className="file-input"
            onChange={(e) => {
              const f = e.target.files && e.target.files[0];
              setFile(f || null);
            }}
          />

          <div style={{ marginTop: "14px" }}>
            <button
              type="submit"
              className="btn btn-primary btn-small"
              disabled={sending}
            >
              {sending ? "Posting..." : "Post"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}