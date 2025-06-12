// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA0Uh4IEXNumX57nzLYAJmHj_7jckW7av8",
  authDomain: "prediciones-de-maiz.firebaseapp.com",
  projectId: "prediciones-de-maiz",
  storageBucket: "prediciones-de-maiz.firebasestorage.app",
  messagingSenderId: "477067701282",
  appId: "1:477067701282:web:f20226490a2ede8c91ee7b",
  measurementId: "G-3DN0606EEF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);