// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCxHSBoSEwb4SXM7miaIfk_ncDjwsqdm3I",
  authDomain: "vepa-f9a45.firebaseapp.com",
  databaseURL: "https://vepa-f9a45-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "vepa-f9a45",
  storageBucket: "vepa-f9a45.appspot.com",
  messagingSenderId: "532210443434",
  appId: "1:532210443434:web:c3e252ecd773f1d6b05cd3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { app, auth, db, firebaseConfig };
