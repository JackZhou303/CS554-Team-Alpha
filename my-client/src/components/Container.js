import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import Game from "./Game";
import Home from "./Home";

class Container extends Component {
  
  render() {
    return (
      <div>
        <Switch>
          <Route path="/" exact component={Home}/>
          <Route path="/game" component={Game}/>
        </Switch>
      </div>
    );
  }
}

export default Container;
