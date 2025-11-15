// src/components/FollowButton.jsx
import { useEffect, useState } from "react";
import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import { db, timestamp } from "../firebase";
import { useAuth } from "../contexts/AuthContext";

export default function FollowButton({ targetUid }) {
  const { currentUser } = useAuth();
  const [isFollowing, setIsFollowing] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!currentUser || !targetUid || currentUser.uid === targetUid) return;

    const ref = doc(db, "follows", `${currentUser.uid}_${targetUid}`);
    getDoc(ref)
      .then((snap) => {
        setIsFollowing(snap.exists());
      })
      .catch((err) => console.error("Follow check error", err));
  }, [currentUser, targetUid]);

  if (!currentUser || currentUser.uid === targetUid) return null;

  async function toggleFollow() {
    setBusy(true);
    const ref = doc(db, "follows", `${currentUser.uid}_${targetUid}`);

    try {
      if (isFollowing) {
        await deleteDoc(ref);
        setIsFollowing(false);
      } else {
        await setDoc(ref, {
          followerId: currentUser.uid,
          followingId: targetUid,
          createdAt: timestamp(),
        });
        setIsFollowing(true);
      }
    } catch (err) {
      console.error("Toggle follow error", err);
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      onClick={toggleFollow}
      disabled={busy}
      className={`px-3 py-1 rounded-full text-xs border ${
        isFollowing
          ? "bg-slate-800 border-slate-700 text-slate-100"
          : "bg-sky-500 border-sky-500 text-white"
      }`}
    >
      {isFollowing ? "Following" : "Follow"}
    </button>
  );
}
