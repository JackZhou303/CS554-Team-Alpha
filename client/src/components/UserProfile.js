import React, { Component } from "react";
import { BrowserRouter as Router, Route, Redirect} from "react-router-dom";
import { Container,Jumbotron } from "react-bootstrap";
import { firebase, auth} from "../firebase";


class UserProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
        currentUser: null,
        score:0
    };
  }
  
  componentDidMount(){
    //init create first user instance
    let user_snapshot;
    let currentUser = auth.currentUser();
    this.setState({
      currentUser:currentUser,
    })
    firebase.database.ref(currentUser.uid).once("value").then(function(snapshot){
      user_snapshot=snapshot.val();
      if(user_snapshot){
        this.setState({
          score:user_snapshot.score
        })
      }
    })
  }

// auth handler to block un auth user
  render() {
        if(this.state.currentUser){
          return <Container>
          <Jumbotron className="background-transparent">
          <h1>Welcome to the Dashboard</h1>
            <p>Your User Id: {this.state.currentUser.uid}</p>
            <p>Display Name: {this.state.currentUser.displayName}</p>
            <p>Email: {this.state.currentUser.email}</p>
            <p>Username: {this.state.currentUser.photoURL}</p>
            <p>Score: {this.state.score}</p>
          </Jumbotron>
          </Container>

        }
        else return <Jumbotron className="background-transparent"><div>Loading...</div></Jumbotron>

  }
}

export default UserProfile;