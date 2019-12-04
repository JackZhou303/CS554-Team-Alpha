import React, { Component } from "react";
import { BrowserRouter as Router, Route,Link} from "react-router-dom";

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
          <Link to="/login">Home</Link>
          <p>Welcome, Click to Login </p>
        </div>
      );
    
    return body;
  }
}

export default Home;