// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDNAx4IuSxGRxUGM42JhoYWTyugoXst6fA",
  authDomain: "green-valley-school-63d43.firebaseapp.com",
  projectId: "green-valley-school-63d43",
  storageBucket: "green-valley-school-63d43.firebasestorage.app",
  messagingSenderId: "214825392816",
  appId: "1:214825392816:web:6edd480e1061320e82b975"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);