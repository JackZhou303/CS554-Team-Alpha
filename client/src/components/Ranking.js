import React, { Component } from 'react';
import {firebase} from "../firebase";

class Ranking extends Component { 

    constructor(props) {
      super(props);
      this.state = {
         data: []
      };
    }


    componentWillUnmount() {
        clearInterval(this.realTimeInterval);
        }


    async componentDidMount() {
        this.realTimeInterval=setInterval(async () => {
            
        
        let dbRef = firebase.database.ref('/');
        let list = [];
        await dbRef.orderByChild("scores").limitToFirst(10).on('child_added', snap => {
            list.push({username: snap.val().username, score: -1 * snap.val().scores});
            this.setState({data: list});
         });

        }, 3000);
    }

    render() {
        let ranking = (
            <div>
                <h2>Ranking</h2>
                <ol>
        {this.state.data.sort().map((data, id) => <li key={id}>{data.username} : {data.score}</li>)}
                </ol>
           </div>
        );
        return ranking;
    }  


}

export default Ranking;