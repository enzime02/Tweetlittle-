// src/pages/Profile.jsx
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase";
import {
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";
import PostCard from "../components/PostCard";

export default function Profile() {
  const { uid } = useParams();
  const { currentUser } = useAuth();

  const [userData, setUserData] = useState(null);
  const [posts, setPosts] = useState([]);

  const [displayName, setDisplayName] = useState("");
  const [handle, setHandle] = useState("");
  const [bio, setBio] = useState("");

  useEffect(() => {
    if (!uid) return;

    const userRef = doc(db, "users", uid);

    const loadUser = async () => {
      const maxRetries = 3;

      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          const snap = await getDoc(userRef);

          if (snap.exists()) {
            const data = snap.data();
            setUserData(data);

            setDisplayName(data.displayName || "");
            setHandle(data.handle || "");
            setBio(data.bio || "");
          } else {
            setUserData({
              displayName: "Unknown user",
              handle: "username",
              bio: "",
            });
          }

          return;
        } catch (e) {
          console.error(
            `getDoc profile error (attempt ${attempt}):`,
            e.code,
            e.message,
            e
          );

          if (e.code === "unavailable" && attempt < maxRetries) {
            await new Promise((res) => setTimeout(res, 800 * attempt));
          } else {
            setUserData({
              displayName: "Error loading profile",
              handle: "username",
              bio: "",
              __error: true,
            });
            return;
          }
        }
      }
    };

    loadUser();

    const postsQuery = query(
      collection(db, "posts"),
      where("userId", "==", uid)
    );

    const unsub = onSnapshot(
      postsQuery,
      (snap) => {
        const list = snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));
        setPosts(list);
      },
      (e) => {
        console.error(
          "onSnapshot posts error:",
          e.code,
          e.message,
          e
        );
      }
    );

    return () => unsub();
  }, [uid]);

async function saveProfile() {
  if (!currentUser || currentUser.uid !== uid) return;

  try {
    const ref = doc(db, "users", uid);

    // Crea el doc si no existe, o lo actualiza si ya existe
    await setDoc(
      ref,
      {
        displayName,
        handle,
        bio,
      },
      { merge: true }
    );

    // Opcional: actualizamos el estado local para que se vea al tiro
    setUserData((prev) => ({
      ...(prev || {}),
      displayName,
      handle,
      bio,
    }));

    alert("Profile updated!");
  } catch (e) {
    console.error("setDoc profile error:", e.code, e.message, e);
    alert("Error updating profile");
  }
}

  const isOwnProfile = currentUser && currentUser.uid === uid;
  const isErrorState = userData && userData.__error;

  // Loading simple
  if (!userData) {
    return (
      <>
        <div className="page-header">
          <h1 className="page-header-title">Profile</h1>
        </div>
        <div className="profile-wrapper">
          <p style={{ color: "#9ca3af", fontSize: 14 }}>Loading profile...</p>
        </div>
      </>
    );
  }

  const avatarLetter =
    (userData.displayName && userData.displayName[0].toUpperCase()) || "U";

  return (
    <>
      <div className="page-header">
        <h1 className="page-header-title">Profile</h1>
      </div>

      {/* HEADER + BIO */}
      <div className="profile-wrapper">
        <div className="profile-main">
          <div className="profile-avatar-large">{avatarLetter}</div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div className="profile-name">
                {userData.displayName || "Unknown user"}
              </div>
              {isOwnProfile && (
                <span className="post-badge">You</span>
              )}
            </div>
            <div className="profile-username">
              @{userData.handle || "username"}
            </div>
          </div>
        </div>

        {userData.bio && (
          <p className="profile-bio">{userData.bio}</p>
        )}

        {isErrorState && (
          <div className="profile-alert">
            <strong>Couldn&apos;t load profile.</strong>{" "}
            Check your connection or try again later.
          </div>
        )}

        {/* EDIT PROFILE */}
        {isOwnProfile && !isErrorState && (
          <div className="profile-edit">
            <h2 className="profile-edit-title">Edit profile</h2>

            <div className="profile-edit-row">
              <div className="profile-field">
                <label>Display name</label>
                <input
                  type="text"
                  className="field"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Your public name"
                />
              </div>

              <div className="profile-field">
                <label>Handle</label>
                <input
                  type="text"
                  className="field"
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                  placeholder="@username"
                />
              </div>
            </div>

            <div className="profile-field">
              <label>Bio</label>
              <textarea
                className="textarea"
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell people a bit about you..."
              />
            </div>

            <div className="profile-edit-actions">
              <button
                type="button"
                className="btn btn-primary btn-small"
                onClick={saveProfile}
              >
                Save changes
              </button>
            </div>
          </div>
        )}
      </div>

      {/* POSTS */}
      <div className="profile-wrapper">
        <h2 className="profile-edit-title" style={{ marginBottom: 8 }}>
          Posts
        </h2>

        {posts.length === 0 && (
          <p className="profile-empty">No posts yet.</p>
        )}

        <div className="feed-list">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </>
  );
}
