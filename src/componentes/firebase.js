import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBv640u9qQDfm2me_ovO15_j8xnDfYbeOY",
    authDomain: "threads-661d8.firebaseapp.com",
    projectId: "threads-661d8",
    storageBucket: "threads-661d8.firebasestorage.app",
    messagingSenderId: "109993270098",
    appId: "1:109993270098:web:bd555387f4d1b529e4b88b",
    measurementId: "G-4CD7SFCTTJ"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
