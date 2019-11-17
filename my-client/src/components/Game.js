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
          <p>This is your life Bar</p>
        </div>
      );
    
    return body;
  }
}

export default Home;