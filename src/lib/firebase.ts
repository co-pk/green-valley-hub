// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDK_MMjzSwHpaPPIfq2vY8Wts1ejia4Mmo",
  authDomain: "belony-web.firebaseapp.com",
  projectId: "belony-web",
  storageBucket: "belony-web.firebasestorage.app",
  messagingSenderId: "874532761502",
  appId: "1:874532761502:web:1027a1fa7128b60e86b08f",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
