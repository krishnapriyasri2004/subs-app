// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCBhMqzzo42pI0BmPrO5D4FBMzWkJTnvJw",
  authDomain: "vendorhub-123.firebaseapp.com",
  projectId: "vendorhub-123",
  storageBucket: "vendorhub-123.firebasestorage.app",
  messagingSenderId: "925725394600",
  appId: "1:925725394600:web:12024bf5ae416e6dc1249d",
  measurementId: "G-Y755T57MR8"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);