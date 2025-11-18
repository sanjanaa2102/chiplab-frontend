import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

// --- YOUR CONFIGURATION ---
const firebaseConfig = {
  apiKey: "AIzaSyAFg4tcsLoZI50Gdomz8WOICs6TRjNTPh8",
  authDomain: "aethersim-project.firebaseapp.com",
  projectId: "aethersim-project",
  storageBucket: "aethersim-project.firebasestorage.app",
  messagingSenderId: "150318171336",
  appId: "1:150318171336:web:9fa021241684d6f6bc11fd",
  measurementId: "G-NKV2B7SLH4"
};

// 1. Initialize Firebase
const app = initializeApp(firebaseConfig);

// 2. Initialize Authentication
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

// 3. Export Helper Functions (This makes login easy)
export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error("Login failed:", error);
  }
};

export const logout = async () => {
  await signOut(auth);
};