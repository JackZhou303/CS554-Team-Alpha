import React, { Component } from "react";
import "./App.css";
import SignIn from "./components/Signin";
import SignUp from "./components/SignUp";
import Game from "./components/Game";
import Home from "./components/Home";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import { BrowserRouter as Router, Route, Switch, Redirect} from "react-router-dom";
import { firebase } from "./firebase";
import UserProfile from "./components/UserProfile";

class App extends Component {
  constructor(props) {
      super(props);
      this.state = {};
  }
  
  render() {
    return (
      <Router>
        <Switch>
            <React.Fragment>
        <div className="App">
          <br/>
          <div className="App-body">
            <Route path="/" exact component={Home} />
            <PrivateRoute path="/game" component={Game} />
            <Route path="/login" component={Login}/>
            <Route path="/signin" component={SignIn}/>
            <Route path="/signup" component={SignUp}/>
            <PrivateRoute path="/dashboard" component={Dashboard}/>
            <PrivateRoute path="/user" component={UserProfile}/>
          </div>
        </div>
           </React.Fragment>
        </Switch>
      </Router>
    );
  }
}

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      firebase.isAuthenticated() === true ? (
        <Component {...props} {...rest} />
      ) : (
        <Redirect
          to={{
            pathname: "/signin"
          }}
        />
      )
    }
    />
);

export default App;
