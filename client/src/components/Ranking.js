import React, { Component } from 'react';

class Ranking extends Component { 

    constructor(props) {
      super(props);
      this.state = {
         data: []
      };
    }


    //When mount, call back end api to get data
    async componentDidMount() {
        
    }
   

    render() {
        let ranking = (
            <div>
                <h2>Ranking</h2>
                <ol>
                   <li>
                       Item
                    </li>
                </ol>
           </div>
        );
        return ranking;
    }  


}

export default Ranking;