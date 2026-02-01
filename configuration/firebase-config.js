import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getFunctions } from "firebase/functions";

const firebaseConfig = {
  apiKey: "AIzaSyAXnZpKi9sYI-t7kMBxMiuMe1SvQkZCEAY",
  authDomain: "brandraize-f2864.firebaseapp.com",
  projectId: "brandraize-f2864",
  storageBucket: "brandraize-f2864.firebasestorage.app",
  messagingSenderId: "903000794585",
  appId: "1:903000794585:web:e2930909d7086c57ef65c8",
  measurementId: "G-20M5GNX86N"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const functions = getFunctions(app);

export { auth, db, storage, functions };
