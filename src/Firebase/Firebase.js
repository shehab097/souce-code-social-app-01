import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth"
import {getFirestore} from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyCR2u5oQp-WPLYaABtnXHg32yQMxbD2acg",
  authDomain: "fireapp-46cf9.firebaseapp.com",
  projectId: "fireapp-46cf9",
  storageBucket: "fireapp-46cf9.firebasestorage.app",
  messagingSenderId: "173795927606",
  appId: "1:173795927606:web:d7319452512a678eec5a97",
  measurementId: "G-C32DTFGQMM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const db = getFirestore(app)
