// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import firebaseConfig from './utils/firebaseConfig';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// firebaseConfig.js

const firebaseConfig = {
  apiKey: "AIzaSyDdU78jGMGePgp4_gMYSy6hnPGH2y1zArw",
  authDomain: "medibuddy-3e27a.firebaseapp.com",
  projectId: "medibuddy-3e27a",
  storageBucket: "medibuddy-3e27a.appspot.com",
  messagingSenderId: "1008324428988",
  appId: "1:1008324428988:android:efd643a20962a2e529bcb9",
};

export default firebaseConfig;


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);