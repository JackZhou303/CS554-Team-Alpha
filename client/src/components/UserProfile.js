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

  get_current_user(){
    const current_user= auth.currentUser();
    console.log(current_user)
    return current_user
  }

  async componentDidMount(){
    const user= this.get_current_user();
//     //init create first user instance
// <<<<<<< HEAD
//     let user_snapshot;
//     let currentUser = auth.currentUser();
//     this.setState({
//       currentUser:currentUser,
//     })
//     firebase.database.ref(currentUser.uid).once("value").then(function(snapshot){
//       user_snapshot=snapshot.val();
//       if(user_snapshot){
//         this.setState({
//           score:user_snapshot.score
//         })
//       }
//     })
// =======
    let user_snapshot, user_info;
    user_snapshot= await firebase.database.ref(user.uid).once("value");
    user_snapshot= user_snapshot.val()

    if(!user_snapshot || !user_snapshot.hasProfile){
      firebase.database.ref(user.uid).set({
          displayName: user.displayName,
          email: user.email, 
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
// >>>>>>> f6768c7a10416b4efba5ca87427d77e3e2e859dc
  }

// auth handler to block un auth user
  render() {
        if(this.state.currentUser){
          return <Container>
          <Jumbotron className="background-transparent">
          <h1>Welcome to the Dashboard</h1>
            <p>Display Name: {this.state.currentUser.displayName}</p>
            <p>Email: {this.state.currentUser.email}</p>
            <p>Scores: {-1* this.state.currentUser.scores}</p>
            <p>Game Played: { this.state.currentUser.played_games}</p>
            {/* {this.state.currentUser.photoURL?<p> </p>:<p>Username:{this.state.currentUser.photoURL}</p>} */}
          </Jumbotron>
          </Container>

        }
        else return <Jumbotron className="background-transparent"><div>Loading...</div></Jumbotron>

  }
}

export default UserProfile;