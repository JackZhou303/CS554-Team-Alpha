import React, { Component } from "react";
import { BrowserRouter as Router, Route,Link} from "react-router-dom";
import { Container,Jumbotron } from "react-bootstrap";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    let body = null;
    
      body = (
        <Container>
            <Jumbotron className="background-transparent">
            <h1>Welcome to the Dashboard</h1>
            <p>To begin start by clicking the play icon below</p>
            <a href="/game">Start Game</a>
          </Jumbotron>
        </Container>
      );
    
    return body;
  }
}

export default Dashboard;