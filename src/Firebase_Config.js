import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBKba8K2JwjgJ-K49avV48pBjGBJxuT16I",
  authDomain: "leasecar-36e33.firebaseapp.com",
  projectId: "leasecar-36e33",
  storageBucket: "leasecar-36e33.appspot.com",
  messagingSenderId: "632314605969",
  appId: "1:632314605969:web:34ce0e9eeca984028b2a30",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const database = getFirestore(app);
export const storage = getStorage(app);
