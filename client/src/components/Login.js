import React, { Component } from "react";
import "../App.css";
import {  Redirect } from "react-router-dom";
import { firebase } from "../firebase";
  
class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }
  checkAuthentication=()=>{
    if(firebase.isAuthenticated()){
      return <Redirect to="/dashboard"></Redirect>
    }else{  
      return <Redirect to="/signin"></Redirect>
    }
  }
  
  componentDidMount() {
    console.log(firebase.isAuthenticated());
  }

  render() {
    return (
      this.checkAuthentication()
    );
  }
}

export default Login;