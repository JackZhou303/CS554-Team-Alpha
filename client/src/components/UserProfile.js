import React, { Component } from "react";
import { BrowserRouter as Router, Route, Redirect} from "react-router-dom";
import { Container,Jumbotron } from "react-bootstrap";
import { auth, firebase } from "../firebase";


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
    this.setState({
        currentUser: current_user
    }, console.log(current_user))
  }

  componentDidMount(){
    this.get_current_user();
  }

// auth handler to block un auth user
  render() {
      
        return <Container>
            <Jumbotron className="background-transparent">
            <h1>Welcome to the Dashboard</h1>
          </Jumbotron>
        </Container>

    // }  else return <Redirect to="/signin"></Redirect>
  
  }
}

export default UserProfile;