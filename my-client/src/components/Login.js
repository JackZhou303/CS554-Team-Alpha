import React, { Component } from "react";
import "../App.css";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import { firebase } from "../firebase";
import Container from "./Container";
import SignIn from "./Signin";  
class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      authUser: null
    };
  }
  checkAuthentication=()=>{
    if(firebase.isAuthenticated()){
      return <Redirect to="/game"></Redirect>
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