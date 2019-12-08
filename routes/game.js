const express = require('express');
const request = require('request');
const router = express.Router();
const SpotifyWebApi = require('spotify-web-api-node');

let scopes = ['streaming','user-read-private', 'user-read-email','playlist-read-private', 'playlist-modify-public','playlist-modify-private']

let spotifyApi = new SpotifyWebApi({
    clientId: '3cc049e06d534a8b853a48d4792ac432',
    clientSecret: '697ff37969b04b41bfa1ea60de4a0038',
    redirectUri: "http://localhost:4000/api/game-control/callback",
})


let my_client_id = '3cc049e06d534a8b853a48d4792ac432';
let redirect_uri= "http://localhost:4000/api/game-control/callback";
//server side storage
let token; //access token
let album="spotify:album:5ht7ItJgpBH7W6vJ5BqpPr"
let user_id, total_tracks, answers;


async function get_tracks(genre){
  let playlist_id;
  // Get user id
  if(!user_id){
    try {
      let data = await spotifyApi.getMe();
      user_id= data.body.id;
      //console.log(user_id)
    } catch (err) {
      console.log('Something went wrong!', err); 
    }
  }

  // Get user playlist id
  try { 
    let data = await spotifyApi.getUserPlaylists(user_id);
    let items =data.body.items;
    //console.log(items);
    let playlist= items.find(item => item.name === genre)
    //console.log(playlist);
     playlist_id=playlist.id
    console.log('User picked playlist ', playlist_id);
  } catch (err) {
     console.log('Something went wrong!', err); 
  }

  try {
    let data= await spotifyApi.getPlaylist(playlist_id);
    let items= data.body.tracks.items;
    let tracks=items.map(a => a.track.uri);
    let track_names=items.map(a => a.track.name);
    total_tracks=tracks.length;
    answers=track_names;

    console.log('List of track id', tracks);
    console.log('List of answers', track_names);
    return tracks;

  } catch (err) {
    console.log('Something went wrong!', err);  
  }
  
}

router.get('/token', async (req, res) => {
    res.send({token: token})
});

router.get('/total_tracks', async (req, res) => {
  res.send({total: total_tracks})
});

router.get('/answers', async (req, res) => {
  res.send({answers: answers})
});

router.get('/refresh-token', async (req, res) => {
  res.send({token: token})
});

router.post('/play', async (req, res) => {
  const{ device, position, offset, genre}=req.body;
  console.log(genre);

  const tracks= await get_tracks(genre);
  

  const request_body={
    "uris": tracks,
    "offset": {"position": offset},
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

      token=access_token;
      res.redirect("http://localhost:4000/api/game-control/token")
    } catch(err) {
      res.redirect('/#/error/invalid token');
    }
  });


  module.exports = router;