import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA210P8bmemJmV60VmerhotsFMQGd25AgA",
  authDomain: "kuretin-41b83.firebaseapp.com",
  projectId: "kuretin-41b83",
  storageBucket: "kuretin-41b83.appspot.com",
  messagingSenderId: "913710952961",
  appId: "1:913710952961:web:ff94071c9e48e5305ec600",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
