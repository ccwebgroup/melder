import { initializeApp } from "firebase/app";

// // Add the Firebase services that you want to use
import {
  getFirestore,
  collection,
  doc,
  addDoc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
  query,
  where,
} from "firebase/firestore";

import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAg0Z6Tzyb5ySBe6tODn08l0OcqZ7ylnY0",
  authDomain: "melder-b37e2.firebaseapp.com",
  projectId: "melder-b37e2",
  storageBucket: "melder-b37e2.appspot.com",
  messagingSenderId: "543609861904",
  appId: "1:543609861904:web:5788de0e3a83a11af89795",
};

// Initialize Firebase
let firebaseApp = initializeApp(firebaseConfig);
let db = getFirestore();
let auth = getAuth();

export {
  auth,
  db,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  updateProfile,
  createUserWithEmailAndPassword,
  collection,
  addDoc,
  getDocs,
  setDoc,
  doc,
  updateDoc,
  arrayUnion,
  getDoc,
  query,
  where,
};
