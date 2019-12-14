import React, { Component } from "react";
import { NavLink} from "react-router-dom";
import { Container, Jumbotron } from "react-bootstrap";
import Ranking from './Ranking';
import SignOutButton from './SignOut';

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: null
    };
  }

  render() {
    let links, signout;

    signout = (
      <div>
          <SignOutButton></SignOutButton>
      </div>
    )
    
      links= (
        <div>
        <NavLink to="/game" activeClassName="active">
              Start a Game
        </NavLink>
            <br/>
        <NavLink to="/user" activeClassName="active">
              My Profile
        </NavLink>
        </div>
      );
    
        return <Container>
            <Jumbotron className="background-transparent">
            <h1>Welcome to the Dashboard</h1>
            <p>To begin start by clicking the play icon below</p>
            {links}
            {signout}
          </Jumbotron>
          <Jumbotron className="background-transparent">
            <Ranking/>
          </Jumbotron>
        </Container>

    // }  else return <Redirect to="/signin"></Redirect>
  
  }
}

export default Dashboard;