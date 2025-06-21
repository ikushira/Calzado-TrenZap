import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyApT7US4oqtbAczDkvjp8cBj1y4qiFesws",
  authDomain: "calzado-trendzap.firebaseapp.com",
  projectId: "calzado-trendzap",
  storageBucket: "calzado-trendzap.appspot.com",
  messagingSenderId: "721505110941",
  appId: "1:721505110941:web:67c72a1c99aaf96ee4bd74",
  measurementId: "G-JTQDKV76PW"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };
