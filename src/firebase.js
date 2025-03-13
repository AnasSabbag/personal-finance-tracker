// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth,GoogleAuthProvider } from "firebase/auth";
import { getFirestore,doc,setDoc } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB1U3yGXMBIOyZmyC0_4uQ4ABWazqvwq-g",
  authDomain: "personal-finance-tracker-57b30.firebaseapp.com",
  projectId: "personal-finance-tracker-57b30",
  storageBucket: "personal-finance-tracker-57b30.firebasestorage.app",
  messagingSenderId: "609003069461",
  appId: "1:609003069461:web:f6aac9601c8b9611fa2e1c",
  measurementId: "G-144JJWT476"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
 // eslint-disable-next-line
const analytics = getAnalytics(app);
const db= getFirestore(app);
const auth= getAuth(app);
const provider = new GoogleAuthProvider();


export {db,auth,provider,doc,setDoc};
