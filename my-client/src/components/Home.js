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
          <p>Welcome, you must be the new trainer! </p>
          <p>Here you can find all the information you need to 
            become a top trainer. </p>
            <p> We have the information of Pokemons, berries and machines which are
            essencial for your journey.
          </p>
        </div>
      );
    
    return body;
  }
}

export default Home;