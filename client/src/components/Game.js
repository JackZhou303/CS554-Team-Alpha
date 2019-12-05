import React, { Component } from 'react';
import {Link} from "react-router-dom";
import {Form,FormControl,InputGroup,Button, Jumbotron} from 'react-bootstrap'
import SignOutButton from './SignOut';
import { ServiceApi } from '../service';

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
        value: " ",
        points:0
     }
    this.play = this.play.bind(this);
    this.skip = this.skip.bind(this);
    this.play_game= this.play_game.bind(this);
    this.verify_answer= this.verify_answer.bind(this);
    this.handleChange = this.handleChange.bind(this);
    }

    async componentDidMount() {
        this._isMounted = true;
        console.log("game is mounted")
        const responseJson = await ServiceApi.get_token();
        //console.log(responseJson)
        window._DEFAULT_DATA = responseJson.token;
        this.setState(() => ({
            total_tracks: 2
        }), console.log("2"))

        this.myInterval = setInterval(() => {
            if(window._DEVICE_ID){
                this.setState(() => ({
                    device_ready: true
                }))
             console.log("Device is ready")
             clearInterval(this.myInterval)   
            }
        }, 500)
    }

    componentWillUnmount(){
        this._isMounted = false;
        clearInterval(this.playInterval);
        clearInterval(this.timeInterval);
        clearInterval(this.skipInterval);
    }


    async play() {
        //console.log(JSON.stringify(window._DEVICE_ID))
        let position;
        if(window._PAUSE_POSITION) position = window._PAUSE_POSITION;
        else position = 0
        await ServiceApi.play_song(window._DEVICE_ID, position);
            this.setState(() => ({
                isPaused: false
            }))
            let seconds=10;
            this.playInterval = setInterval(async () => {
                
                if (seconds > 0) {
                        seconds=seconds - 1
                    }
                
                if (seconds === 0) {
                        console.log("play replay")
                        clearInterval(this.playInterval)
                        await this.pause()
                } 
            }, 1000)
            //console.log(data)
    }


    async skip() {

     if(this.state.current_track < this.state.total_tracks - 1){
        await ServiceApi.skip_song(window._DEVICE_ID);
        let seconds=10;
        this.skipInterval = setInterval(async () => {   
            if (seconds > 0) {
                seconds = seconds - 1
                }
            if (seconds === 0) {
                console.log("skip replay")
                clearInterval(this.skipInterval)
                await this.pause()
                } 
        }, 1000)
        this.setState(() => ({
            current_track: this.state.current_track + 1
        }))
    }
    else {
        await this.pause();
        this.setState(() => ({
            isPlayin: false,
            result: true
        }))
      }
    }

    async pause() {
        await ServiceApi.pause_song(window._DEVICE_ID);
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


    async play_game(){
        if(!this.state.isPlayin){
            this.setState(() => ({
                isPlayin: true,
                current_track: 0
            }), 
            await this.play(), this.start_time()
            )
        }
    }

    handleChange(event) {
        this.setState({value: event.target.value});
      }
    
    async verify_answer(event) {
        console.log('A answer was submitted: ' + this.state.value);
        if(this._isMounted && this.state.value.includes("ch")) {
            this.setState({points: this.state.points+1}, await this.skip(), this.add_life_points());
        }
      }

    add_life_points() {
        const { seconds, minutes } = this.state
        if(seconds+20 > 60){
            this.setState(({ minutes, seconds }) => ({
                minutes: minutes + 1,
                seconds: seconds + 20 - 60
            }))
        }else {
        this.setState(({ seconds }) => ({
            seconds: seconds + 20
        }))
       }
    }


    render() {
        //html components
        let timer = null,signout=null;
        let input_box=null;
        const { minutes, seconds } = this.state
        signout = (
            <div>
                <SignOutButton></SignOutButton>
            </div>
        )
        timer = (
            <div>
                <p>This is your life Bar</p>
            { minutes === 0 && seconds === 0
                        ? <div><h1>Busted!</h1> <Link to={`/`}><button className="pageBtn" >Home</button></Link></div>
                        : <h1>Time Remaining: {minutes}:{seconds < 10 ? `0${seconds}` : seconds}</h1>
            }
            </div>
        );

        input_box=(
                <div>
                    <form>
                    <input type="text" value={this.state.value} onChange={this.handleChange} />
                    <input onClick={this.verify_answer} type="button" value="Submit" />
                    </form>
                </div>

        );
        
        //rendering logics
        if(minutes === 0 && seconds === 0){
            return timer
        }
        else if(this.state.result && !this.state.isPlayin ) {
            return (<Jumbotron className="background-transparent"><div><h1>Game End</h1> <h1>Final Points: {this.state.points}</h1><Link to={`/`}><button className="pageBtn" >Home</button></Link></div></Jumbotron>)
        }   
        else if(this.state.device_ready && this.state.isPlayin ){
            return ( 
                <Jumbotron className="background-transparent">    
            <div>
                {signout}
                <h1>Current Points: {this.state.points}</h1>
                {timer}
                {input_box}
                {this.state.isPaused ? <button className="game_btn" onClick={this.play}>Listen More</button>: ""}
                <button className="game_btn" onClick={this.skip}>Skip Song</button>
            </div>
            </Jumbotron>
          )
        } else if(this.state.device_ready && !this.state.isPlayin ) {
            return <Jumbotron className="background-transparent"><button className="add_life" onClick={this.play_game}>Play Game</button></Jumbotron>
        }   
        else return <Jumbotron className="background-transparent"><div>Loading...</div></Jumbotron>
    }
}