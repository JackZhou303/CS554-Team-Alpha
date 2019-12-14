import React, { Component } from "react";
import { NavLink} from "react-router-dom";
import { Container, Jumbotron, Image, Col, Row } from "react-bootstrap";
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
        <Container>
          <Row>
            <Col>
              <NavLink to="/game" activeClassName="active">
                  <Image src="img/play.png" className="image-width-height-80" rounded ></Image>
              </NavLink>
            </Col>
              <br/>
            <Col>
              <NavLink to="/user" activeClassName="active">
                <Image src="img/profile.jpg" className="animated bounce image-width-height-80" rounded>
                  </Image>
              </NavLink>
            </Col>
          </Row>
          <Row>
            <Col className="font-text-width">
              Play the Game Now
            </Col>
            <Col className="font-text-width">
              Check your Profile
            </Col>
          </Row>
        </Container>
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