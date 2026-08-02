import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyC92WWIaye1nZKW6s3gg6RAf-ODjEJ4Xec",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "franchise-lead-b1c73.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "franchise-lead-b1c73",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "franchise-lead-b1c73.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "259891790262",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:259891790262:web:87caa36c126852ae1f4117",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-FNLS5Z087P"
};

// Firebase 앱 초기화 여부 검증
export const isFirebaseConfigured = true;

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
