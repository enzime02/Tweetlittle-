import { useEffect, useState } from "react";
import {
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../contexts/AuthContext";

export default function FollowButton({ targetUid }) {
  const { currentUser } = useAuth();
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!currentUser || !targetUid) {
      return;
    }

    const id = currentUser.uid + "_" + targetUid;
    const ref = doc(db, "follows", id);

    getDoc(ref).then((snap) => {
      setIsFollowing(snap.exists());
    });
  }, [currentUser, targetUid]);

  async function toggleFollow() {
    if (!currentUser || currentUser.uid === targetUid || loading) {
      return;
    }

    setLoading(true);
    const id = currentUser.uid + "_" + targetUid;
    const ref = doc(db, "follows", id);

    try {
      if (isFollowing) {
        await deleteDoc(ref);
        setIsFollowing(false);
      } else {
        await setDoc(ref, {
          followerUid: currentUser.uid,
          targetUid: targetUid,
          createdAt: serverTimestamp(),
        });
        setIsFollowing(true);
      }
    } finally {
      setLoading(false);
    }
  }

  if (!currentUser || currentUser.uid === targetUid) {
    return null;
  }

  const btnClass =
    "btn-follow " + (isFollowing ? "btn-follow-outline" : "btn-follow-primary");

  return (
    <button type="button" onClick={toggleFollow} disabled={loading} className={btnClass}>
      {isFollowing ? "Following" : "Follow"}
    </button>
  );
}