import React, { Component } from 'react';
import {NavLink} from "react-router-dom";
import {Jumbotron} from 'react-bootstrap'
import { ServiceApi } from '../service';
import {auth,firebase} from "../firebase";


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
        answers:[],
        try_again: false,
        result: false,
        value: " ",
        genre_value:" ",
        points:0
     }
     

    this.play = this.play.bind(this);
    this.skip = this.skip.bind(this);
    this.play_game= this.play_game.bind(this);
    this.verify_answer= this.verify_answer.bind(this);
    this.handle_answer = this.handle_answer.bind(this);
    this.handle_toggle_genre = this.handle_toggle_genre.bind(this);
    this.submit_scores= this.submit_scores.bind(this);
    }

    async componentDidMount() {
        this._isMounted = true;
        console.log("game is mounted")
        const responseJson = await ServiceApi.get_token();
        window._DEFAULT_DATA = responseJson.token;

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

    componentWillUnmount() {
        this._isMounted = false;
        this.clearAllIntervals();
    }

    clearAllIntervals(){
        clearInterval(this.playInterval);
        clearInterval(this.timeInterval);
        clearInterval(this.skipInterval);
    }


    async play() {
        //console.log(JSON.stringify(window._DEVICE_ID))
        let position;
        
        if(window._PAUSE_POSITION) position = window._PAUSE_POSITION;
        else position = 0
        await ServiceApi.play_song(window._DEVICE_ID, position, this.state.current_track);
        this.setState(() => ({
                isPaused: false
            }))
        let seconds = 10;
        this.playInterval = setInterval(async () => {
                
                if (seconds > 0) {
                    seconds = seconds - 1
                }
                if (seconds === 0) {
                        console.log("play replay")
                        clearInterval(this.playInterval)
                        await this.pause()
                } 
            }, 1000)
    }


    async skip() {

     if(this.state.current_track < this.state.total_tracks - 1){
        this.setState(() => ({
            isPaused: false
        }))
        await ServiceApi.skip_song(window._DEVICE_ID);
        let seconds = 10;
        clearInterval(this.playInterval)
        clearInterval(this.skipInterval)
        this.skipInterval = setInterval( async () => {   
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
        this.clearAllIntervals();
        this.setState(() => ({
            isPlayin: false,
            result: true
        }))
      }
    }

    async pause() {
        await ServiceApi.pause_song(window._DEVICE_ID);
        this.setState(() => ({
            isPaused: true
        }))
    }

    start_time() {
        this.timeInterval = setInterval(async () => {
            const { seconds, minutes } = this.state
    
            if (seconds > 0) {
                this.setState(({ seconds }) => ({
                    seconds: seconds - 1
                }))
            }
            if (seconds === 0) {
                if (minutes === 0) {
                    await this.pause();
                    clearInterval(this.timeInterval);
                    clearInterval(this.playInterval);
                    clearInterval(this.skipInterval);
                } else {
                    this.setState(({ minutes }) => ({
                        minutes: minutes - 1,
                        seconds: 59
                    }))
                }
            } 
        }, 1000)
    }

    async get_tracks_and_play() {
        const {total_tracks, answers} = await ServiceApi.get_track_info(this.state.genre_value);
        window._PAUSE_POSITION = 0;
        await this.play();
        this.setState(() => ({
            total_tracks: total_tracks,
            answers: answers
        }), console.log(this.state.answers))
    }

    async play_game() {
        if(this.state.genre_value !== " " && this.state.genre_value !== "Choose a Genre" ) {
        if(! this.state.isPlayin) {
            console.log("play game")
            this.setState(() => ({
                isPlayin: true,
                current_track: 0
            }), 
            await this.get_tracks_and_play(), this.start_time())
        }
      }
    }

    handle_answer (event) {
        console.log("Answer entered: " + event.target.value.trim())
        this.setState({value: event.target.value.trim()});
    }

    handle_toggle_genre (event) {
        console.log(event.target.value)
        this.setState({genre_value: event.target.value});
    }
    
    reset_form(){
        this.setState({value: ""});
        if(this.state.isPlayin) {
        document.getElementById("answer-form").value=""
        }
    }

    async verify_answer () {
        let myAnswer;
        if(this.state.value===""){
            myAnswer = document.getElementById("answer-form").value
        } else {
            myAnswer = this.state.value
        }

        console.log('An answer was submitted: ' + myAnswer);
        const current_answer=this.state.answers[this.state.current_track];
        const answer_lowercase = current_answer.toLowerCase();
        const answer_alone = answer_lowercase.replace(/[^a-zA-Z ]+/g, '').replace('/ {2,}/',' ');
        console.log("right answer: "+ current_answer)
        
        if(this._isMounted && (myAnswer === current_answer || myAnswer === answer_alone
            || myAnswer === answer_lowercase)) {
            this.setState({
                points: this.state.points + 1,
                try_again: false
            }, await this.skip(), this.add_life_points(), this.reset_form());
        }
        else {
            this.setState({
                try_again: true
            }, this.reset_form());

        }
    }

    add_life_points () {
        const { seconds, minutes} = this.state
        if(seconds+20 > 60) {
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

    async submit_scores(){
        let score = 0
        let user = auth.currentUser();
        let game_played = 0;
        let snapshot= await firebase.database.ref(user.uid).once("value");
        snapshot= snapshot.val();
        if(snapshot){
            score = -1 * snapshot.scores;
            game_played = snapshot.played_games + 1
            console.log(game_played)
        }
            //saving the highest score of that particular person
        if(score <= this.state.points){
            firebase.database.ref(user.uid).update({
                    scores: -1 * this.state.points,
                    played_games: game_played
            })
        } else {
            firebase.database.ref(user.uid).update({
                played_games: game_played
          })
        }
    }

    render() {

        //html components
        let timer, signout;
        let input_box;
        
        const { minutes, seconds } = this.state
        
        timer = (
            <div>
            { minutes === 0 && seconds === 0
                        ? <div><h1>Game End</h1> <h1>Final Points: {this.state.points}</h1><NavLink to='/dashboard'><button className="pageBtn" >To Dashboard</button></NavLink></div>
                        : <div><p>This is your life Bar</p><h1>Time Remaining: {minutes}:{seconds < 10 ? `0${seconds}` : seconds}</h1></div>
            }
            </div>
        );

        input_box = (
                <div>
                    <form>
                        {this.state.try_again? <p>Try Again!</p>: " "}
                        <input id="answer-form" type="text" onChange={this.handle_answer} />
                        <input onClick={this.verify_answer} type="button" value="Submit" />
                    </form>
                        <button id='btnGiveCommand'>Voice Submit</button>
                </div>

        );

         if(minutes === 0 && seconds === 0){
            return <Jumbotron className="background-transparent"> {timer} </Jumbotron>
        }
        else if(this.state.result && !this.state.isPlayin ) {
            //let user = auth.currentUser();
            
            return (<Jumbotron className="background-transparent"><div><h1>Game End</h1> <h1>Final Points: {this.state.points}</h1><button className="game_btn" onClick={this.submit_scores}>Submit My Scores</button><NavLink to='/dashboard'><button className="pageBtn" >To Dashboard</button></NavLink></div></Jumbotron>)
        }   
        else if(this.state.device_ready && this.state.isPlayin ) {
            return ( 
                <Jumbotron className="background-transparent">    
            <div>
                {signout}
                <h1>Current Points: {this.state.points}</h1>
                {timer}
                {input_box}
                {this.state.isPaused ? <button className="game_btn" onClick={this.play}>Listen More</button> : ""}
                {this.state.isPaused ?<button className="game_btn" onClick={this.skip}>Skip Song</button> : ""}
            </div>
            </Jumbotron>
          )
        } else if(this.state.device_ready && !this.state.isPlayin ) {
            return (<Jumbotron className="background-transparent">
                <div>
                    <select className="genre_input" onChange={this.handle_toggle_genre}>
                        <option value= "Choose a Genre"> Choose a Genre </option>
                        <option value= "Demo1"> Demo1 </option>
                        <option value= "Demo2"> Demo2 </option>
                        <option value= "Demo3"> Demo3 </option>
                    </select>
                    <br/>
                    <button className="play_game" onClick={this.play_game}>
                    Play Game   
                    </button>
                </div>
                </Jumbotron>)
        }   
        else return <Jumbotron className="background-transparent"><div>Loading...</div></Jumbotron>
    }
}