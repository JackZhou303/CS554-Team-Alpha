import React from 'react';
import { auth, firebase } from "./firebase";
import { BrowserRouter as Router, Route,Link,Redirect} from "react-router-dom";

require('firebase/database');

async function doCreateUserWithEmailAndPassword(email, password, displayName) {
  await auth.createUserWithEmailAndPassword(email, password);
    //to check if the username is occupied or not
    //adding username in photourl because it's hard to add username in here
  auth.currentUser.updateProfile({ displayName: displayName});
  console.log(`DISPLAY NAME ${displayName}`);
}

async function doSignInWithEmailAndPassword(email, password) {
  await auth.signInWithEmailAndPassword(email, password);
}

async function doSocialSignIn(provider) {
  let socialProvider = null;
  if (provider === "google") {
    socialProvider = new firebase.auth.GoogleAuthProvider();
  } else if (provider === "facebook") {
    socialProvider = new firebase.auth.FacebookAuthProvider();
  }
  await auth.signInWithPopup(socialProvider);
}

async function doPasswordReset(email) {
  await auth.sendPasswordResetEmail(email);
}

async function doPasswordUpdate(password) {
  await auth.updatePassword(password);
}

async function doSignOut() {
  try{
  await auth.signOut();
  window.location.href="/login";
  }catch(err){
    alert(err)
  }
}

function currentUser(){
  var currentUser = firebase.auth().currentUser;
  return currentUser;
}
function addScoresInFirebase(scores){
  // await firebase.database().ref('rank-list').push({
  // uid: "uid",
  // email: "email",
  // scores: scores
  // },function(error){
  //   if(error){
  //     // alert("Error:"+error)
  //   }else{
  //     // alert("Score submitted");
  //   }
  // });
}

export {
  doCreateUserWithEmailAndPassword,
  doSocialSignIn,
  doSignInWithEmailAndPassword,
  doPasswordReset,
  doPasswordUpdate,
  doSignOut,
  currentUser,
  addScoresInFirebase
};
