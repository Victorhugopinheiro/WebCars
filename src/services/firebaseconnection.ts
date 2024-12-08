import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBqVZ_oDAsO5fvX_Gp7cPxLdrtcrcC8grQ",
  authDomain: "webcar-89fb7.firebaseapp.com",
  projectId: "webcar-89fb7",
  storageBucket: "webcar-89fb7.appspot.com",
  messagingSenderId: "271963391900",
  appId: "1:271963391900:web:75f20de17870759942ea59"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app)
const db = getFirestore(app)
const storage = getStorage(app)

export {auth, db, storage}