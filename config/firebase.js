//"firebase": "^9.10.0",

import * as firebase from "firebase";
import Environment from "./environment";
firebase.initializeApp({
  apiKey: Environment["FIREBASE_API_KEY"],
  authDomain: Environment["FIREBASE_AUTH_DOMAIN"],
  databaseURL: Environment["FIREBASE_DATABASE_URL"],
  projectId: Environment["FIREBASE_PROJECT_ID"],
  storageBucket: Environment["FIREBASE_STORAGE_BUCKET"],
  messagingSenderId: Environment["FIREBASE_MESSAGING_SENDER_ID"],
});
export default firebase;

// Import the functions you need from the SDKs you need
// import firebase from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// import Environment from "./environment";

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: Environment["FIREBASE_API_KEY"],
//   authDomain: Environment["FIREBASE_AUTH_DOMAIN"],
//   databaseURL: Environment["FIREBASE_DATABASE_URL"],
//   projectId: Environment["FIREBASE_PROJECT_ID"],
//   storageBucket: Environment["FIREBASE_STORAGE_BUCKET"],
//   messagingSenderId: Environment["FIREBASE_MESSAGING_SENDER_ID"],
// };

// // Initialize Firebase
// const app = firebase.initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
