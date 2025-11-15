// src/firebase.js
import { initializeApp } from "firebase/app";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import {
  getFirestore,
  serverTimestamp,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyA3rBu9TEFv0pGTKFgTa6BT_eQdmdn0VBE",
  authDomain: "tweetlittle.firebaseapp.com",
  projectId: "tweetlittle",
  storageBucket: "tweetlittle.firebasestorage.app",
  messagingSenderId: "697474268220",
  appId: "1:697474268220:web:4c0e97e1d16783488e5739",
  measurementId: "G-N43WLRFLRC",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const timestamp = serverTimestamp;

// Persistencia de sesión en el navegador
setPersistence(auth, browserLocalPersistence).catch(console.error);
