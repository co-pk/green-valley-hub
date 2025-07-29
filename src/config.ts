// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCUcFr8F6_iZUnQ30z1GjW9Vk930IjCqKA",
  authDomain: "beloney-8d0f1.firebaseapp.com",
  projectId: "beloney-8d0f1",
  storageBucket: "beloney-8d0f1.firebasestorage.app",
  messagingSenderId: "5207712032",
  appId: "1:5207712032:web:36c55bd6cdba4c33667745",
  measurementId: "G-GQDF5JFT4X",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
