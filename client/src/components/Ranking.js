import React, { Component } from 'react';
import {firebase} from "../firebase";

class Ranking extends Component { 

    constructor(props) {
      super(props);
      this.state = {
         data: []
      };
    }

    async componentDidMount() {
        let dbRef = firebase.database.ref('/');
        let list = [];
        await dbRef.orderByChild("scores").limitToFirst(10).on('child_added', snap => {
            list.push({username: snap.val().username, score: -1*snap.val().scores});
            this.setState({data: list});
         });
    }
   

    render() {
        let ranking = (
            <div>
                <h2>Ranking</h2>
                <ol>
                    {this.state.data.sort().map(data => <li>{data.username} : {data.score}</li>)}
                </ol>
           </div>
        );
        return ranking;
    }  


}

export default Ranking;