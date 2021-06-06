// Firebase App (the core Firebase SDK) is always required and must be listed first
import firebase from "firebase/app";
// If you are using v7 or any earlier version of the JS SDK, you should import firebase using namespace import
// import * as firebase from "firebase/app"

// If you enabled Analytics in your project, add the Firebase SDK for Analytics
import "firebase/analytics";

// Add the Firebase products that you want to use
import "firebase/auth";
import "firebase/database";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDE1CXS0VRXZNaamlhf0F0vLmsjNv-rB4I",
    authDomain: "midori-timer.firebaseapp.com",
    databaseURL: "https://midori-timer-default-rtdb.firebaseio.com",
    projectId: "midori-timer",
    storageBucket: "midori-timer.appspot.com",
    messagingSenderId: "18829507131",
    appId: "1:18829507131:web:3166e1bd6fca9fbf61ba1e",
    measurementId: "G-PLY0RGF9QD"
  };
  
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// use emulator
// firebase.database().useEmulator("localhost", 9000 );

//https://firebase.google.com/docs/database/web/start?authuser=0

export default firebase;



