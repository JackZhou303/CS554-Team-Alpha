import React, { Component } from "react";
import { BrowserRouter as Router, Route,Link} from "react-router-dom";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    let body = null;
    
      body = (
        <div>
          <a href="http://localhost:3000/login">To Play Click here</a>
          <p>Welcome, Click to Login </p>
        </div>
      );
    
    return body;
  }
}

export default Dashboard;