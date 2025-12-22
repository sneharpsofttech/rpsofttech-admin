import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyAJpPvqr7_o0U1R_P8F1CcczABnNJqTyaQ",
  authDomain: "rpsofttech-b69fc.firebaseapp.com",
  databaseURL: "https://rpsofttech-b69fc-default-rtdb.firebaseio.com",
  projectId: "rpsofttech-b69fc",
  storageBucket: "rpsofttech-b69fc.firebasestorage.app",
  messagingSenderId: "412780922992",
  appId: "1:412780922992:web:8719bef9d0d562b9b84cb5",
  measurementId: "G-Y8HL01ZTJC"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);