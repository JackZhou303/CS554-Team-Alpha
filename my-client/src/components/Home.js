import React, { Component } from "react";
import { BrowserRouter as Router, Route,Link} from "react-router-dom";
import {Jumbotron,Button, Container,Row} from 'react-bootstrap';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    let body = null;
    
      body = (
        <div>
          <Container>
            <Row><p></p></Row>
            <Row><p></p></Row>
            <Row><p></p></Row>
            <Row><p></p></Row>
          </Container>
            <Jumbotron className="background-transparent">
            <h1>Music Guesser</h1>
            <p>
              Music Guesser is a fun to play app which deals with playing with music and trying to guess the correct song.
              You can see your song lists and your rank as well. 
            </p>
            <p>
              
          <Link to="/login"><Button variant="primary">Login with our App</Button></Link>
            </p>
          </Jumbotron>
        </div>
      );
    
    return body;
  }
}

export default Home;