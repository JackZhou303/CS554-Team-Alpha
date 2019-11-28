import React, { Component } from "react";
import logo from "./img/logo.svg";
import "./App.css";
import Container from "./components/Container";
import { BrowserRouter as Router, Route} from "react-router-dom";

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
            <h1 className="App-title">Welcome to the Music Experts</h1>
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
