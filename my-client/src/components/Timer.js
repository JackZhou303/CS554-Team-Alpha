import React, { Component } from 'react'
import {Link} from "react-router-dom";
import Game from "./Game";


export default class Timer extends Component {
    constructor(props) {
        super(props);
    this.state = {
        minutes: 1,
        seconds: 0,
        apiResponse: ""
     }
    this.add_life_points = this.add_life_points.bind(this);
    this.play = this.play.bind(this);
    //this.SDK = this.SDK.bind(this);
    }

    callAPI() {
        fetch("http://localhost:3000/home")
            .then(res => res.json())
            .then(res => {
              window._DEFAULT_DATA=res.token;
            })
            .catch(err => err);
    }

    componentDidMount() {

        this.callAPI();
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

    play() {
        console.log(JSON.stringify(window._DEVICE_ID))
        fetch('http://localhost:3000/play', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
            body:JSON.stringify({device: window._DEVICE_ID})
        }).then((res) => res.json())
        .then((data) =>  console.log(data))
        .catch((err)=>   console.log(err))
      }

    componentWillUnmount() {
        clearInterval(this.myInterval)
    }

    render() {
        const { minutes, seconds } = this.state
        return (
            
            <div>
                { minutes === 0 && seconds === 0
                    ? <div><h1>Busted!</h1> <Link to={`/`}><button className="pageBtn" >Home</button></Link></div>
                    : <h1>Time Remaining: {minutes}:{seconds < 10 ? `0${seconds}` : seconds}</h1>
                }
                <Game/>
                <button className="add_life" onClick={this.play}>Play Song</button>
                {/* <button className="add_life" onClick={this.SDK}>Play</button> */}
                
            </div>
            
        )
    }
}