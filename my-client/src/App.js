import React, { Component } from "react";
import "./App.css";
import Container from "./components/Container";
import Signin from "./components/Signin";
import SignUp from "./components/SignUp";
import Game from "./components/Game";
import Home from "./components/Home";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import { BrowserRouter as Router, Route,Switch} from "react-router-dom";

class App extends Component {
  constructor(props) {
      super(props);
      this.state = { apiResponse: ""};
  }
  
  render() {
    return (
      <Router>
        <Switch>
        <div className="App">
          <br />
          <div className="App-body">
            <Route path="/" exact component={Home} />
            <Route path="/game" component={Game} />
            <Route path="/login" component={Login}/>
            <Route path="/signin" component={Signin}/>
            <Route path="/signup" component={SignUp}/>
            <Route path="/dashboard" component={Dashboard}/>
          </div>
          
        </div>
        
        </Switch>
      </Router>
    );
  }
}

export default App;
