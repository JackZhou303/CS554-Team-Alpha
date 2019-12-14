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

  async componentDidMount(){
    const user= this.get_current_user();
    //init create first user instance
    let user_snapshot, user_info;
    user_snapshot= await firebase.database.ref(user.uid).once("value");
    user_snapshot= user_snapshot.val()

    if(!user_snapshot || !user_snapshot.hasProfile){
      firebase.database.ref(user.uid).set({
          displayName: user.displayName,
          email: user.email,
          username: " ", 
          scores: 0,
          played_games: 0,
          hasProfile: true
      })
      user_snapshot= await firebase.database.ref(user.uid).once("value");
      user_info= user_snapshot.val()

      console.log(user_info)
    } else user_info= user_snapshot;

    this.setState({
      currentUser: user_info
    }, console.log(user_info))
  }

// auth handler to block un auth user
  render() {
        if(this.state.currentUser){
          return <Container>
          <Jumbotron className="background-transparent">
          <h1>Welcome to the Dashboard</h1>
            <p>Display Name: {this.state.currentUser.displayName}</p>
            <p>Scores: {-1* this.state.currentUser.scores}</p>
            <p>Email: {this.state.currentUser.email}</p>
            <p>Username: {this.state.currentUser.username}</p>
          </Jumbotron>
          </Container>

        }
        else return <Jumbotron className="background-transparent"><div>Loading...</div></Jumbotron>

  }
}

export default UserProfile;