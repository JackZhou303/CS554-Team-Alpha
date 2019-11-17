import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import Game from "./Game";
import Home from "./Home";
import Timer from "./Timer";

class Container extends Component {
  
  render() {
    return (
      <div>
        <Switch>
          <Route path="/" exact component={Home}/>
          <Route path="/game" component={Timer}/>
        </Switch>
      </div>
    );
  }
}

export default Container;
