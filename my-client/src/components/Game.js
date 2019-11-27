import React, { Component } from 'react';
import Timer from "./Timer";


export default class Game extends Component {
    constructor(props) {
        super(props);
    this.state = {
        isPlayin: false,
        device_ready: false
     }
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
            if(window._DEVICE_ID){
                this.setState(() => ({
                    device_ready: true
                }))
             console.log("Device is ready")
             clearInterval(this.myInterval)   
            }
        }, 1000)
    }

    componentWillUnmount(){
        clearInterval(this.myInterval)
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
            let seconds=10;
            this.skipInterval = setInterval(() => {
                
                if (seconds > 0) {
                        seconds=seconds - 1
                    }
                
                if (seconds === 0) {
                        console.log("replay")
                        this.pause()
                        clearInterval(this.skipInterval)
                    } 
            }, 1000)
            //console.log(data)
        })
        .catch((err)=> console.log(err))
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
            //console.log(data)
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
        
    if(this.state.device_ready && this.state.isPlayin ){
        return (
            <div>
                <Timer/>
                <button className="game_btn" onClick={this.play}>Play Song</button>
                
                <button className="game_btn" onClick={this.skip}>Skip Song</button>
            </div>
            
          )
        } else if(this.state.device_ready && !this.state.isPlayin ) {
            return <button className="add_life" onClick={this.play_game}>Play Game</button>
        }   
        else return <div>Loading...</div>
    }
}