export default class ServiceApi {
    static async get_token(){
        try {
            const response= await fetch("http://localhost:3000/api/game-control/token")
            const responseJson= response.json();
            console.log(responseJson)
            return responseJson;
        } catch (error) {
            console.log(error)
        }

    }
    
    static async play_song(device_id, position){

        try {
            await fetch('http://localhost:3000/api/game-control/play', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body:JSON.stringify ({device: device_id, position: position})
                })
            
        } catch (error) {
            console.log(error)
        }
    }


    static async pause_song(device_id){
        try {
            fetch('http://localhost:3000/api/game-control/pause', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                      },
                    body:JSON.stringify({device: device_id})
                })
        } catch (error) {
            console.log(error)
        }
    }

    static async skip_song(device_id){
        try {
            
            await fetch('http://localhost:3000/api/game-control/skip', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                        },
                    body:JSON.stringify({device: device_id})
                })
        } catch (error) {
            console.log(error)
        }
    }


}