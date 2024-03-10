// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyAwS8v3YMrRgs1xruC0hD5FL1kRQeIaw0s",
  authDomain: "wildvote-cit.firebaseapp.com",
  databaseURL: "https://wildvote-cit-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "wildvote-cit",
  storageBucket: "wildvote-cit.appspot.com",
  messagingSenderId: "244968865834",
  appId: "1:244968865834:web:119db168ede6b0eb358353"
};
 
// Initialize Firebase
const app = initializeApp(firebaseConfig);