import firebase from "firebase/app";
import "firebase/auth";
require("firebase/database")
const config = {
  apiKey: "AIzaSyDEJhlya6RHy3oSXtMo4D3Ldzg2Vjq0ksM",
    authDomain: "musicquiz-58fbb.firebaseapp.com",
    databaseURL: "https://musicquiz-58fbb.firebaseio.com",
    projectId: "musicquiz-58fbb",
    storageBucket: "musicquiz-58fbb.appspot.com",
    messagingSenderId: "81055923359",
    appId: "1:81055923359:web:389e4ac9568e32aeae76aa",
    measurementId: "G-DNZH2DKWYH"
};


firebase.initializeApp(config);

const auth = firebase.auth();
const database= firebase.database();

function isAuthenticated() {
  return !!auth.currentUser;
}
export { auth, database, firebase, isAuthenticated };
