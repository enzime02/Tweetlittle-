// src/contexts/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { auth, db, timestamp } from "../firebase";
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Crear usuario + documento en "users"
  async function signup(email, password, displayName, handle) {
    // 1) Crear usuario en Firebase Auth
    const cred = await createUserWithEmailAndPassword(auth, email, password);

    // 2) Actualizar displayName en el perfil de Auth
    if (displayName) {
      await updateProfile(cred.user, { displayName });
    }

    // 3) Crear documento en la colección "users"
    const userDocRef = doc(db, "users", cred.user.uid);
    await setDoc(userDocRef, {
      uid: cred.user.uid,
      email,
      displayName: displayName,
      handle: "@" + handle.toLowerCase(),
      bio: "",
      avatarUrl: "",
      createdAt: timestamp(),
    });

    return cred.user;
  }

  async function login(email, password) {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    return cred.user;
  }

  async function logout() {
    await signOut(auth);
  }

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user || null);
      setLoading(false);
    });

    return unsub;
  }, []);

  const value = {
    currentUser,
    loading,
    signup,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
