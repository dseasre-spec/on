// src/config/firebase.js

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// إعدادات Firebase الخاصة بتطبيقك
const firebaseConfig = {
  apiKey: "AIzaSyA6sBg8leISGasADK-mq_HymvMfp2vjbWA",
  authDomain: "ruknia-de837.firebaseapp.com",
  projectId: "ruknia-de837",
  storageBucket: "ruknia-de837.firebasestorage.app",
  messagingSenderId: "308644539148",
  appId: "1:308644539148:web:3a0d810f41f468a747f729",
  measurementId: "G-FEGYN3VR0M"
};

// تهيئة Firebase
const app = initializeApp(firebaseConfig);

// تهيئة Firestore
export const db = getFirestore(app);

// تهيئة Storage لرفع الصور والفيديو
export const storage = getStorage(app);

export default app;