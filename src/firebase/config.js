// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBImfKJ_IxIi_firRLApE3nzxN-6B4zmzA",
  authDomain: "spill-69a9a.firebaseapp.com",
  projectId: "spill-69a9a",
  storageBucket: "spill-69a9a.firebasestorage.app",
  messagingSenderId: "587270618167",
  appId: "1:587270618167:web:663d73163b323266f653b2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };