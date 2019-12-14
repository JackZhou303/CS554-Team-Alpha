import React, { Component } from "react";
import { BrowserRouter as Router, Route, Redirect} from "react-router-dom";
import { Container,Jumbotron } from "react-bootstrap";
import { firebase, auth} from "../firebase";


class UserProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
        currentUser: null
    };
  }

  get_current_user(){
    const current_user= auth.currentUser();
    console.log(current_user)
    return current_user
  }

  componentDidMount(){
    const user= this.get_current_user();
    this.setState({
      currentUser: user
    }, console.log(user))
    //init create first user instance
    let user_snapshot;
    firebase.database.ref(user.uid).once("value").then(function(snapshot){
      user_snapshot=snapshot.val();
      
    })

    firebase.database.ref(user.uid).set({
        displayName: user.displayName,
        email: user.email,
        username: " ", 
        scores: 0,
        played_games: 0
    })
  }

// auth handler to block un auth user
  render() {

        if(this.state.currentUser){
          return <Container>
          <Jumbotron className="background-transparent">
          <h1>Welcome to the Dashboard</h1>
            <p>Username: {this.state.currentUser.username}</p>
          </Jumbotron>
        </Container>

        }
        else return <Jumbotron className="background-transparent"><div>Loading...</div></Jumbotron>

  }
}

export default UserProfile;