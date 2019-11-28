import React, { Component } from "react";


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

          <a href="http://localhost:3000/login">Login</a>
          <p>Welcome, Click to Login </p>
        </div>
      );
    
    return body;
  }
}

export default Home;