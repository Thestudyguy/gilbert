import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
const firebaseConfig = {
  apiKey: "AIzaSyDkunRqHTm1yzzAy59rU_1m9GSxOZkzpoA",
  authDomain: "gameshopdb-f4df3.firebaseapp.com",
  databaseURL: "https://gameshopdb-f4df3-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "gameshopdb-f4df3",
  storageBucket: "gameshopdb-f4df3.appspot.com",
  messagingSenderId: "60622922093",
  appId: "1:60622922093:web:4dc4cc33c16ac43d5fba64",
  measurementId: "G-HX3FYB2YX2"
};
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);