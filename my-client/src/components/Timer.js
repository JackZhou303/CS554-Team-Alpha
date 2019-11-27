import React, { Component } from 'react'
import {Link} from "react-router-dom";
import Game from "./Game";


export default class Timer extends Component {
    constructor(props) {
        super(props);
    this.state = {
        minutes: 1,
        seconds: 0,
        isPlayin: false
     }
    this.add_life_points = this.add_life_points.bind(this);
    this.play = this.play.bind(this);
    this.skip = this.skip.bind(this);
    this.play_game= this.play_game.bind(this);
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
        //console.log(JSON.stringify(window._DEVICE_ID))
        let position
        if(window._PAUSE_POSITION) position=window._PAUSE_POSITION;
        else position=0
        fetch('http://localhost:3000/play', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
            body:JSON.stringify({device: window._DEVICE_ID, position: position})
        }).then((res) => res.json())
        .then((data) => { 
            let seconds=10;
            this.playInterval = setInterval(() => {
                
                if (seconds > 0) {
                        seconds=seconds - 1
                    }
                
                if (seconds === 0) {
                        console.log("replay")
                        this.pause()
                        clearInterval(this.playInterval)
                    } 
            }, 1000)
            //console.log(data)
        })
        .catch((err)=> console.log(err))
    }


    skip() {
        fetch('http://localhost:3000/skip', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
            body:JSON.stringify({device: window._DEVICE_ID})
        }).then((res) => res.json())
        .then((data) => { 
            //console.log(data)
        })
        .catch((err)=> console.log(err))
    }

    componentWillUnmount() {
        clearInterval(this.myInterval)
    }

    pause() {
        fetch('http://localhost:3000/pause', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
            body:JSON.stringify({device: window._DEVICE_ID})
        }).then((res) => res.json())
        .then((data) => { 
            console.log(data)
        })
        .catch((err)=> console.log(err))
    }

    play_game(){
        if(!this.state.isPlayin){
            this.setState(() => ({
                isPlayin: true
            }), this.play())
        }
    }

    render() {
        const { minutes, seconds } = this.state
        if(window._DEVICE_ID && this.state.isPlayin ){
        
        return (
            <div>
                { minutes === 0 && seconds === 0
                    ? <div><h1>Busted!</h1> <Link to={`/`}><button className="pageBtn" >Home</button></Link></div>
                    : <h1>Time Remaining: {minutes}:{seconds < 10 ? `0${seconds}` : seconds}</h1>
                }
                <Game/>
                <button className="add_life" onClick={this.play}>Play Song</button>
                <button className="add_life" onClick={this.skip}>Skip Song</button>
                {/* <button className="add_life" onClick={this.SDK}>Play</button> */}
                
            </div>
            
          )
        } else if(window._DEVICE_ID && !this.state.isPlayin ){
            return <button className="add_life" onClick={this.play_game}>Play Game</button>
        }   
        else return <div>Loading...</div>
    }
}