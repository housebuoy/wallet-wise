// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, GithubAuthProvider   } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBMN5ESx7d_v9yCdfREesSaGCvvW1WfpSg",
  authDomain: "walletwise-24673.firebaseapp.com",
  projectId: "walletwise-24673",
  storageBucket: "walletwise-24673.firebasestorage.app",
  messagingSenderId: "409974141722",
  appId: "1:409974141722:web:324e03fbfdcffc3c5ef2a3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };
export const googleProvider = new GoogleAuthProvider();
export const githubAuthProvider  = new GithubAuthProvider();