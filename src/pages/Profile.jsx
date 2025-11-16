import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";

export default function Profile() {
  const { uid } = useParams();
  const { currentUser } = useAuth();

  const [userData, setUserData] = useState(null);
  const [posts, setPosts] = useState([]);

  // Editable fields
  const [displayName, setDisplayName] = useState("");
  const [handle, setHandle] = useState("");
  const [bio, setBio] = useState("");

  // Load profile + posts
  useEffect(() => {
    if (!uid) return;

    // ----- LOAD USER PROFILE -----
    const userRef = doc(db, "users", uid);

    getDoc(userRef).then((snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setUserData(data);

        setDisplayName(data.displayName || "");
        setHandle(data.handle || "");
        setBio(data.bio || "");
      } else {
        // Prevent infinite "Loading..."
        setUserData({
          displayName: "Unknown user",
          handle: "",
          bio: "",
        });
      }
    });

    // ----- LOAD USER POSTS -----
    const postsQuery = query(collection(db, "posts"), where("userId", "==", uid));

    const unsub = onSnapshot(postsQuery, (snap) => {
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setPosts(list);
    });

    return () => unsub();
  }, [uid]);

  // Save profile changes
  async function saveProfile() {
    if (!currentUser || currentUser.uid !== uid) return;

    const ref = doc(db, "users", uid);
    await updateDoc(ref, {
      displayName,
      handle,
      bio,
    });

    alert("Profile updated!");
  }

  // Loading state
  if (!userData) {
    return (
      <div className="page">
        <h2>Loading profile...</h2>
      </div>
    );
  }

  return (
    <div className="page">
      <h1>Profile</h1>

      {/* ----- PROFILE INFO ----- */}
      <div className="profile-box">
        <h2>{userData.displayName}</h2>
        <p>@{userData.handle}</p>
        <p>{userData.bio}</p>
      </div>

      {/* ----- EDIT PROFILE (only yourself) ----- */}
      {currentUser && currentUser.uid === uid && (
        <div className="profile-edit-box">
          <h3>Edit Profile</h3>

          <input
            type="text"
            placeholder="Display name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />

          <input
            type="text"
            placeholder="Handle"
            value={handle}
            onChange={(e) => setHandle(e.target.value)}
          />

          <textarea
            placeholder="Bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />

          <button onClick={saveProfile}>Save</button>
        </div>
      )}

      {/* ----- USER POSTS ----- */}
      <h2 style={{ marginTop: "40px" }}>Posts</h2>
      {posts.length === 0 && <p>No posts yet.</p>}

      <div className="posts-list">
        {posts.map((post) => (
          <div key={post.id} className="post-box">
            <p>{post.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}