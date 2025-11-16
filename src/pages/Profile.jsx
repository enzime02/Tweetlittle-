import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";
import FollowButton from "../components/FollowButton";
import PostCard from "../components/PostCard";

export default function Profile() {
  const { uid } = useParams();
  const { currentUser } = useAuth();

  const [user, setUser] = useState(null);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [posts, setPosts] = useState([]);

  const [editing, setEditing] = useState(false);
  const [displayNameInput, setDisplayNameInput] = useState("");
  const [handleInput, setHandleInput] = useState("");
  const [bioInput, setBioInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  const isOwnProfile = currentUser && currentUser.uid === uid;

  useEffect(() => {
    const userRef = doc(db, "users", uid);
    getDoc(userRef).then((snap) => {
      const data = snap.data();
      setUser(data);
      if (data) {
        setDisplayNameInput(data.displayName || "");
        setHandleInput(data.handle || "");
        setBioInput(data.bio || "");
      }
    });

    const qFollowers = query(
      collection(db, "follows"),
      where("targetUid", "==", uid)
    );
    const unsubFollowers = onSnapshot(qFollowers, (snap) => {
      setFollowers(snap.docs.map((d) => d.id));
    });

    const qFollowing = query(
      collection(db, "follows"),
      where("followerUid", "==", uid)
    );
    const unsubFollowing = onSnapshot(qFollowing, (snap) => {
      setFollowing(snap.docs.map((d) => d.id));
    });

    const qPosts = query(
      collection(db, "posts"),
      where("userId", "==", uid)
    );
    const unsubPosts = onSnapshot(qPosts, (snap) => {
      setPosts(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    return () => {
      unsubFollowers();
      unsubFollowing();
      unsubPosts();
    };
  }, [uid]);

  async function handleSaveProfile(e) {
    e.preventDefault();
    if (!isOwnProfile) return;

    setSaving(true);
    setSaveError("");

    try {
      const userRef = doc(db, "users", uid);
      await updateDoc(userRef, {
        displayName: displayNameInput || "User",
        handle: handleInput.toLowerCase(),
        bio: bioInput,
      });

      setUser((prev) =>
        prev
          ? {
              ...prev,
              displayName: displayNameInput || "User",
              handle: handleInput.toLowerCase(),
              bio: bioInput,
            }
          : prev
      );

      setEditing(false);
    } catch (err) {
      console.error(err);
      setSaveError("Could not save profile. Try again.");
    } finally {
      setSaving(false);
    }
  }

  if (!user) {
    return null;
  }

  return (
    <>
      <div className="page-header">
        <h1 className="page-header-title">
          {user.displayName || "Profile"}
        </h1>
      </div>

      <div className="profile-wrapper">
        <div className="profile-main">
          <div className="profile-avatar-large">
            {(user.displayName && user.displayName[0].toUpperCase()) || "U"}
          </div>

          {isOwnProfile ? (
            <button
              type="button"
              className="btn btn-outline btn-small"
              onClick={() => setEditing((v) => !v)}
            >
              {editing ? "Cancel" : "Edit profile"}
            </button>
          ) : (
            <FollowButton targetUid={uid} />
          )}
        </div>

        <div className="profile-stats">
          <span>{followers.length} Followers</span>
          <span>{following.length} Following</span>
        </div>

        {user.bio && !editing && (
          <p
            style={{
              marginTop: "8px",
              fontSize: "14px",
              whiteSpace: "pre-wrap",
            }}
          >
            {user.bio}
          </p>
        )}

        {editing && (
          <form
            onSubmit={handleSaveProfile}
            style={{ marginTop: "12px", display: "flex", flexDirection: "column", gap: "8px" }}
          >
            {saveError && (
              <div
                style={{
                  fontSize: "13px",
                  color: "#fecaca",
                }}
              >
                {saveError}
              </div>
            )}

            <input
              className="field"
              placeholder="Display name"
              value={displayNameInput}
              onChange={(e) => setDisplayNameInput(e.target.value)}
            />

            <input
              className="field"
              placeholder="Handle (username)"
              value={handleInput}
              onChange={(e) => setHandleInput(e.target.value)}
            />

            <textarea
              className="field"
              style={{ minHeight: "70px", resize: "vertical" }}
              placeholder="Bio"
              value={bioInput}
              onChange={(e) => setBioInput(e.target.value)}
            />

            <div style={{ marginTop: "4px" }}>
              <button
                type="submit"
                className="btn btn-primary btn-small"
                disabled={saving}
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
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