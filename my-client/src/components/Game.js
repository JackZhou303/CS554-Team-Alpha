import React, { Component } from 'react';
import {Link} from "react-router-dom";


export default class Game extends Component {
    constructor(props) {
        super(props);
    this.state = {
        minutes: 1,
        seconds: 0,
        isPlayin: false,
        isPaused: false,
        device_ready: false,
        current_track: 0,
        total_tracks:0,
        result: false,
        value: " "
     }
    this.play = this.play.bind(this);
    this.skip = this.skip.bind(this);
    this.play_game= this.play_game.bind(this);
    this.verify_answer= this.verify_answer.bind(this);
    this.handleChange = this.handleChange.bind(this);
    }

    callAPI() {
        fetch("http://localhost:3000/home")
            .then(res => res.json())
            .then(res => {
              window._DEFAULT_DATA=res.token;
              this.setState(() => ({
                    total_tracks: 2
                }), console.log("2"))
            })
            .catch(err => err);
    }

    componentDidMount() {
        this._isMounted = true;
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
        this._isMounted = false;
        clearInterval(this.myInterval)
    }


    play() {
        //console.log(JSON.stringify(window._DEVICE_ID))
        let position
        if(window._PAUSE_POSITION) position = window._PAUSE_POSITION;
        else position = 0
        fetch('http://localhost:3000/play', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
            body:JSON.stringify({device: window._DEVICE_ID, position: position})
        }).then((res) => res.json())
        .then((data) => { 
            this.setState(() => ({
                isPaused: false
            }))
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

    if(this.state.current_track < this.state.total_tracks-1){
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
            this.setState(() => ({
                current_track: this.state.current_track+1
            }))
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
    else {
        this.pause();
        clearInterval(this.timeInterval)
        this.setState(() => ({
            isPlayin: false,
            result: true
        }))
    }

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
            this.setState(() => ({
                isPaused: true
            }))
        })
        .catch((err)=> console.log(err))
    }

    start_time(){
        this.timeInterval = setInterval(() => {
            const { seconds, minutes } = this.state
    
            if (seconds > 0) {
                this.setState(({ seconds }) => ({
                    seconds: seconds - 1
                }))
            }
            if (seconds === 0) {
                if (minutes === 0) {
                    clearInterval(this.timeInterval)
                } else {
                    this.setState(({ minutes }) => ({
                        minutes: minutes - 1,
                        seconds: 59
                    }))
                }
            } 
        }, 1000)
    }


    play_game(){
        if(!this.state.isPlayin){
            this.setState(() => ({
                isPlayin: true,
                current_track: 0
            }), 
            this.play(), this.start_time()
            )
        }
    }

       handleChange(event) {
        this.setState({value: event.target.value});
      }
    
      verify_answer(event) {
        alert('A name was submitted: ' + this.state.value);
        event.preventDefault();
      }


    render() {
        //html components
        let timer = null;
        let input_box=null;
        const { minutes, seconds } = this.state
        timer = (
            <div>
            { minutes === 0 && seconds === 0
                        ? <div><h1>Busted!</h1> <Link to={`/`}><button className="pageBtn" >Home</button></Link></div>
                        : <h1>Time Remaining: {minutes}:{seconds < 10 ? `0${seconds}` : seconds}</h1>
            }
            <p>This is your life Bar</p>
            </div>
        );

        input_box=(
                <div>
                    <form onSubmit={this.verify_answer}>
                    <input type="text" value={this.state.value} onChange={this.handleChange} />
                    <input type="submit" value="Submit" />
                    </form>
                </div>

        );
        
        //rendering logics
        if(minutes === 0 && seconds === 0){
            return timer
        }
        else if(this.state.result && !this.state.isPlayin ) {
            return (<div><h1>Game End</h1> <Link to={`/`}><button className="pageBtn" >Home</button></Link></div>)
        }   
        else if(this.state.device_ready && this.state.isPlayin ){
            return (
            <div>
                {timer}
                {input_box}
                {this.state.isPaused ? <button className="game_btn" onClick={this.play}>Listen More</button>: ""}
                <button className="game_btn" onClick={this.skip}>Skip Song</button>
            </div>
          )
        } else if(this.state.device_ready && !this.state.isPlayin ) {
            return <button className="add_life" onClick={this.play_game}>Play Game</button>
        }   
        else return <div>Loading...</div>
    }
}