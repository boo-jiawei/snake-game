import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAeJuMtgbKa_AAuG1Z1Ks2zihpDU1CmThc",
  authDomain: "react-snake-77f5c.firebaseapp.com",
  projectId: "react-snake-77f5c",
  storageBucket: "react-snake-77f5c.firebasestorage.app",
  messagingSenderId: "57170693611",
  appId: "1:57170693611:web:26e6b2c42a93966a6b9dae",
  measurementId: "G-5VRM7LS685"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)