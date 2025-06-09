// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore/lite';
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBKnUHSbUsKLjimSuA9VlihQ6IVgqle3Gc",
  authDomain: "staff-attendance-tracker-d2dbb.firebaseapp.com",
  projectId: "staff-attendance-tracker-d2dbb",
  storageBucket: "staff-attendance-tracker-d2dbb.firebasestorage.app",
  messagingSenderId: "871478448695",
  appId: "1:871478448695:web:05773591b45a6eccf265b2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
 