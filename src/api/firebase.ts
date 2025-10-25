// src/api/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";

//CONFIGURACIÓN DE FIREBASE
const firebaseConfig = {
  apiKey: "AIzaSyAmIc4e3Ghm4wH9QEqOr-kmzW4UJsev4T4",
  authDomain: "suenamas-89e43.firebaseapp.com",
  projectId: "suenamas-89e43",
  storageBucket: "suenamas-89e43.firebasestorage.app",
  messagingSenderId: "457687591873",
  appId: "1:457687591873:web:297eb715ecfb4d5d8f9d40",
  measurementId: "G-3FGMDJXY2J"
};


// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Exportar los servicios que usaremos en la aplicación
export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app);