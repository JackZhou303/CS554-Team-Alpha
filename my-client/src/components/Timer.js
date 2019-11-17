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
    //this.SDK = this.SDK.bind(this);
    }

    // SDK(){
    //     window.onSpotifyWebPlaybackSDKReady = () => {
    //         const token = this.state.apiResponse;
    //         const player = new Spotify.Player({
    //           name: 'Web Playback SDK Quick Start Player',
    //           getOAuthToken: cb => { cb(token); }
    //         });
          
    //         // Error handling
    //         player.addListener('initialization_error', ({ message }) => { console.error(message); });
    //         player.addListener('authentication_error', ({ message }) => { console.error(message); });
    //         player.addListener('account_error', ({ message }) => { console.error(message); });
    //         player.addListener('playback_error', ({ message }) => { console.error(message); });
          
    //         // Playback status updates
    //         player.addListener('player_state_changed', state => { console.log(state); });
          
    //         // Ready
    //         player.addListener('ready', ({ device_id }) => {
    //           console.log('Ready with Device ID', device_id);
    //         });
          
    //         // Not Ready
    //         player.addListener('not_ready', ({ device_id }) => {
    //           console.log('Device ID has gone offline', device_id);
    //         });
          
    //         // Connect to the player!
    //         player.connect();
    //       };
    //    }

    callAPI() {
        fetch("http://localhost:3000/home")
            .then(res => res.json())
            .then(res => 
              this.setState({ apiResponse: res.token }))
            .catch(err => err);
    }

    componentDidMount() {
        // const script = document.createElement("script");
        // script.async = true;
        // script.src = "https://sdk.scdn.co/spotify-player.js";
        // document.head.appendChild(script);
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
                <p className="App-intro">{this.state.apiResponse}</p>
                <button className="add_life" onClick={this.add_life_points}>Add</button>
                {/* <button className="add_life" onClick={this.SDK}>Play</button> */}
            </div>
            
        )
    }
}