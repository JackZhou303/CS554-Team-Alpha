var express = require('express');
const app = express();
var cors = require("cors");
var request = require('request');


var SpotifyWebApi = require('spotify-web-api-node');
scopes = ['streaming','user-read-private', 'user-read-email','playlist-read-private', 'playlist-modify-public','playlist-modify-private']

require('dotenv').config();
app.use(cors());
app.use(express.json());

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded());

// credentials are optional
let spotifyApi = new SpotifyWebApi({
    clientId: '3cc049e06d534a8b853a48d4792ac432',
    clientSecret: '697ff37969b04b41bfa1ea60de4a0038',
    redirectUri: "http://localhost:3000/callback",
})



let my_client_id = '3cc049e06d534a8b853a48d4792ac432';
let redirect_uri= "http://localhost:3000/callback";
//server side storage
let token; //access token
let album="spotify:album:5ht7ItJgpBH7W6vJ5BqpPr"

app.get('/home', async (req, res) => {
    res.send({token: token})
});

app.post('/play', async (req, res) => {
  console.log(req.body)

  const{ device, position}=req.body;
  const request_body={
      "uris": ["spotify:track:7ce20yLkzuXXLUhzIDoZih", "spotify:track:5bvnqVuq7UFl0txSlHpsfS"],
     "position_ms": position
      }
  let clientServerOptions = {
    uri: "https://api.spotify.com/v1/me/player/play?device_id="+device,
    body: JSON.stringify(request_body),
    method: 'PUT',
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "Authorization": "Bearer "+ token
    }
}
 request(clientServerOptions, function (error, response) {
    console.log(error, response.body);
    return;
});

  res.send(req.body)
});



app.post('/pause', async (req, res) => {
  console.log(req.body)
  let device_id=req.body.device;
  let clientServerOptions = {
    uri: "https://api.spotify.com/v1/me/player/pause?device_id="+device_id,
    method: 'PUT',
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "Authorization": "Bearer "+ token
    }
}
 request(clientServerOptions, function (error, response) {
    console.log(error, response.body);
    return;
});

  res.send(req.body)
});

app.post('/skip', async (req, res) => {
  console.log(req.body)
  let device_id=req.body.device;
  let clientServerOptions = {
    uri: "https://api.spotify.com/v1/me/player/next?device_id="+device_id,
    method: 'POST',
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "Authorization": "Bearer "+ token
    }
}
 request(clientServerOptions, function (error, response) {
    console.log(error, response.body);
    return;
});

  res.send(req.body)
});



app.get('/login', function(req, res) {
    res.redirect('https://accounts.spotify.com/authorize' +
      '?response_type=code' +
      '&client_id=' + my_client_id +
      (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
      '&redirect_uri=' + encodeURIComponent(redirect_uri));
    //res.json({token:"Yes"})
});

app.get('/callback', async (req,res) => {
    const { code } = req.query;
    //console.log(code)
    try {
      var data = await spotifyApi.authorizationCodeGrant(code)
      //console.log(data)
      const { access_token, refresh_token } = data.body;
      spotifyApi.setAccessToken(access_token);
      spotifyApi.setRefreshToken(refresh_token);

      let user_id;
      spotifyApi.getMe()
      .then(function(data) {
        console.log('Some information about the authenticated user', data.body);
        user_id=data.body.id
      }, function(err) {
        console.log('Something went wrong!', err);
      });

      spotifyApi.getUserPlaylists(user_id)
  .then(function(data) {
    console.log('Retrieved playlists', data.body.items);
  },function(err) {
    console.log('Something went wrong!', err);
    });

      token=access_token;
      res.redirect("http://localhost:3001/game")
    } catch(err) {
      res.redirect('/#/error/invalid token');
    }
  });

app.listen(3000, ()=> {
    console.log("The Server is running on port 3000");
});