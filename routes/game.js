const express = require('express');
const request = require('request');
const router = express.Router();
const SpotifyWebApi = require('spotify-web-api-node');

let scopes = ['streaming','user-read-private', 'user-read-email','playlist-read-private', 'playlist-modify-public','playlist-modify-private']

let spotifyApi = new SpotifyWebApi({
    clientId: '3cc049e06d534a8b853a48d4792ac432',
    clientSecret: '697ff37969b04b41bfa1ea60de4a0038',
    redirectUri: "http://localhost:3000/api/game-control/callback",
})


let my_client_id = '3cc049e06d534a8b853a48d4792ac432';
let redirect_uri= "http://localhost:3000/api/game-control/callback";
//server side storage
let token; //access token
let album="spotify:album:5ht7ItJgpBH7W6vJ5BqpPr"

router.get('/token', async (req, res) => {
    res.send({token: token})
});

router.post('/play', async (req, res) => {

  const{ device, position}=req.body;
  const request_body={
      "uris": ["spotify:track:7ce20yLkzuXXLUhzIDoZih", "spotify:track:5bvnqVuq7UFl0txSlHpsfS"],
     "position_ms": position
      }
  let requestOptions = {
    uri: "https://api.spotify.com/v1/me/player/play?device_id="+device,
    body: JSON.stringify(request_body),
    method: 'PUT',
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "Authorization": "Bearer "+ token
    }
}
 request(requestOptions, function (error, response) {
  if(error){
    console.log(error, response.body);
   }
    return;
});

  res.send(req.body)
});



router.post('/pause', async (req, res) => {
  //console.log(req.body)
  let device_id=req.body.device;
  let requestOptions = {
    uri: "https://api.spotify.com/v1/me/player/pause?device_id="+device_id,
    method: 'PUT',
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "Authorization": "Bearer "+ token
    }
}
 request(requestOptions, function (error, response) {
   if(error){
    console.log(error, response.body);
   }
    return;
});

  res.send(req.body)
});

router.post('/skip', async (req, res) => {
  //console.log(req.body)
  let device_id=req.body.device;
  let requestOptions = {
    uri: "https://api.spotify.com/v1/me/player/next?device_id="+device_id,
    method: 'POST',
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "Authorization": "Bearer "+ token
    }
}
 request(requestOptions, function (error, response) {
  if(error){
    console.log(error, response.body);
   }
    return;
});

  res.send(req.body)
});

router.get('/spotify-login', function(req, res) {
    res.redirect('https://accounts.spotify.com/authorize' +
      '?response_type=code' +
      '&client_id=' + my_client_id +
      (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
      '&redirect_uri=' + encodeURIComponent(redirect_uri));
    //res.json({token:"Yes"})
});

router.get('/callback', async (req,res) => {
    const { code } = req.query;
    //console.log(code)
    try {
      var data = await spotifyApi.authorizationCodeGrant(code)
      //console.log(data)
      const { access_token, refresh_token } = data.body;
      spotifyApi.setAccessToken(access_token);
      spotifyApi.setRefreshToken(refresh_token);

  //   spotifyApi.getPlaylist('646INfOSOFxj47tJszYnWV')
  // .then(function(data) {
  //   console.log('Some information about this playlist', data.body.tracks.items);
  // }, function(err) {
  //   console.log('Something went wrong!', err);
  // });

      token=access_token;
      res.redirect("http://localhost:3000/api/game-control/token")
    } catch(err) {
      res.redirect('/#/error/invalid token');
    }
  });

  router.get('/tracks', async (req,res) => {

    let user_id;
    let playlist=[]

    spotifyApi.getMe()
    .then(function(data) {
      //console.log('Some information about the authenticated user', data.body);
      user_id=data.body.id
    }, function(err) {
      console.log('Something went wrong!', err);
    });

    spotifyApi.getUserPlaylists(user_id)
   .then(function(data) {
     let items=data.body.items
     for(let i in items){
       playlist.push(items[i].id)
     }
  console.log('Retrieved playlists', playlist);
  },function(err) {
  console.log('Something went wrong!', err);
  });
  });

  module.exports = router;