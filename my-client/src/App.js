import React, { Component } from "react";
import logo from "./img/logo.svg";
import "./App.css";
import Container from "./components/Container";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

class App extends Component {
  constructor(props) {
      super(props);
      this.state = { apiResponse: ""};
  }
  
  render() {
    return (
      <Router>
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h1 className="App-title">Welcome to the Pokemon API</h1>
            {/* <Link className="showlink" to="http://localhost:3000/callback">
              Start a Game
            </Link> */}
            <a href="http://localhost:3000/login">Policies</a>
          </header>
          <br />
          <div className="App-body">
            <Route path="/" exact component={Container} />
            <Route path="/game" component={Container} />
          </div>
        </div>
        
      </Router>
    );
  }
}

export default App;
