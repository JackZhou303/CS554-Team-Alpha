import React, { Component } from "react";
import { NavLink} from "react-router-dom";
import { Container, Jumbotron, Image, Col, Row } from "react-bootstrap";
import Ranking from './Ranking';
import SignOutButton from './SignOut';
import { auth, firebase} from "../firebase";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isNew: true
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
    let user_snapshot
    user_snapshot= await firebase.database.ref(user.uid).once("value");
    user_snapshot= user_snapshot.val()


    if(user_snapshot){
      this.setState({
        isNew: false
      })
    }
  }
  

  render() {

    
    let game_link, profile_link, profile_link_with_warning, signout;

    signout = (
      <div>
          <SignOutButton></SignOutButton>
      </div>
    )
    
    game_link= (
      <div>
      <NavLink to="/game" activeClassName="active">
            Start a Game
      </NavLink>
      
      </div>
    );
      
      profile_link= (
        <div>
        <NavLink to="/user" activeClassName="active">
              My Profile
        </NavLink>
        </div>
      );

      profile_link_with_warning= (
        <div>
          <h2>Please click to initialize your profile</h2>
        <NavLink to="/user" activeClassName="active">
              My Profile
        </NavLink>
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
            {!this.state.isNew? game_link: ""}
            {!this.state.isNew? profile_link: profile_link_with_warning}
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