const firebaseConfig = {
  apiKey: "AIzaSyA0Uh4IEXNumX57nzLYAJmHj_7jckW7av8",
  authDomain: "prediciones-de-maiz.firebaseapp.com",
  projectId: "prediciones-de-maiz",
  storageBucket: "prediciones-de-maiz.firebasestorage.app",
  messagingSenderId: "477067701282",
  appId: "1:477067701282:web:f20226490a2ede8c91ee7b",
  measurementId: "G-3DN0606EEF"
};
// Inicializar Firebase
firebase.initializeApp(firebaseConfig);

// Inicializar autenticación
const auth = firebase.auth();
const googleProvider = new firebase.auth.GoogleAuthProvider();