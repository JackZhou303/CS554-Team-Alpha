import React, { Component } from "react";
import {Link} from "react-router-dom";

class Timer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      minutes: 1,
      seconds: 0
   }
    this.add_life_points = this.add_life_points.bind(this);
  }

  componentDidMount() {
    this.myInterval = setInterval(() => {
        const { seconds, minutes } = this.state

        if (seconds > 0) {
            this.setState(({ seconds }) => ({
                seconds: seconds - 1
            }))
        }
        if (seconds === 0) {
            if (minutes === 0) {
                clearInterval(this.myInterval)
            } else {
                this.setState(({ minutes }) => ({
                    minutes: minutes - 1,
                    seconds: 59
                }))
            }
        } 
    }, 1000)
  }


  componentWillUnmount() {
    clearInterval(this.myInterval)
  }

  async add_life_points() {
    const { seconds, minutes } = this.state
    if(seconds+20 > 60){
        this.setState(({ minutes, seconds }) => ({
            minutes: minutes + 1,
            seconds: seconds + 20- 60
        }))
    }else {
    this.setState(({ seconds }) => ({
        seconds: seconds + 20
    }))
   }
}

  render() {
    let body = null;
    
    const { minutes, seconds } = this.state
      body = (
        <div>
          { minutes === 0 && seconds === 0
                    ? <div><h1>Busted!</h1> <Link to={`/`}><button className="pageBtn" >Home</button></Link></div>
                    : <h1>Time Remaining: {minutes}:{seconds < 10 ? `0${seconds}` : seconds}</h1>
          }
          <p>This is your life Bar</p>
          <button className="game_btn" onClick={this.add_life_points}>Add Life Points</button>
        </div>
      );
    
    return body;
  }
}

export default Timer;