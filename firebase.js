// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyA0Uh4IEXNumX57nzLYAJmHj_7jckW7av8",
  authDomain: "prediciones-de-maiz.firebaseapp.com",
  projectId: "prediciones-de-maiz",
  storageBucket: "prediciones-de-maiz.appspot.com",
  messagingSenderId: "477067701282",
  appId: "1:477067701282:web:f20226490a2ede8c91ee7b",
  measurementId: "G-3DN0606EEF"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };
