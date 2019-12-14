import React, { Component } from "react";
import { NavLink} from "react-router-dom";
import { Container,Jumbotron } from "react-bootstrap";
import Ranking from './Ranking';


class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    // let body = null;
    // if(firebase.isAuthenticated()){
      
        return <Container>
            <Jumbotron className="background-transparent">
            <h1>Welcome to the Dashboard</h1>
            <p>To begin start by clicking the play icon below</p>
            <NavLink exact to="/game" activeClassName="active">
          Start a Game
        </NavLink>
        <NavLink exact to="/user" activeClassName="active">
          My Profile
        </NavLink>
          </Jumbotron>
          <Jumbotron className="background-transparent">
            <Ranking/>
          </Jumbotron>
        </Container>

    // }  else return <Redirect to="/signin"></Redirect>
  
  }
}

export default Dashboard;