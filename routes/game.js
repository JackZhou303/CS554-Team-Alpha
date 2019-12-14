const express = require('express');
const request = require('request');
const router = express.Router();
const SpotifyWebApi = require('spotify-web-api-node');
const helper= require('./game.helper');
require('dotenv').config();

let scopes = ['streaming','user-read-private', 'user-read-email','playlist-read-private', 'playlist-modify-public','playlist-modify-private']

let spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    redirectUri: "http://localhost:4000/api/game-control/callback",
})


let my_client_id = process.env.CLIENT_ID;
let redirect_uri= "http://localhost:4000/api/game-control/callback";
let user_id, tracks;


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
    let track_list=items.map(a => a.track.uri);
    let track_names=items.map(a => a.track.name);
    //randomize play list

    for(let i = track_list.length -1; i > 0; i--){
      const j = Math.floor(Math.random() * i)

      const temp = track_list[i]
      track_list[i] = track_list[j]
      track_list[j] = temp

      const temp2 = track_names[i]
      track_names[i] = track_names[j]
      track_names[j] = temp2
    }
    
    console.log('List of track id', track_list);
    console.log('List of answers', track_names);
    return {track_list, track_names};

  } catch (err) {
    console.log('Something went wrong!', err);  
  }
  
}

async function swap_and_refresh_token(){
  try {
    const data= await spotifyApi.refreshAccessToken();
    const access_token= data.body['access_token'];
    await spotifyApi.setAccessToken(access_token);
    const refresh_token= await helper.getToken('refresh_token');
    await helper.saveToken({'access_token': access_token, 'refresh_token': refresh_token});
  } catch (error) {
    console.log('Could not refresh access token', error);
  }
};

router.post('/track_info', async (req, res) => {
  const {genre}= req.body
  let {track_list, track_names} = await get_tracks(genre);
  tracks= track_list
  let total_tracks=track_list.length;
  res.send ({total_tracks: total_tracks, answers: track_names})
});

router.get('/token', async (req, res) => {
    try {
      const token= await helper.getToken('access_token');
      res.send ({token: token})
    } catch (error) {
      console.log(error)
      
    }
});


router.post('/play', async (req, res) => {
  const{ device, position, offset}=req.body;

  const request_body = {
    "uris": tracks,
    "offset": {"position": offset},
    "position_ms": position
  }

  const token =await helper.getToken('access_token')
  let requestOptions = {
    uri: "https://api.spotify.com/v1/me/player/play?device_id=" + device,
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
  
  const token= await helper.getToken('access_token');
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

  const token= await helper.getToken('access_token');
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
      const tokenJson = {'access_token': access_token, 'refresh_token': refresh_token}
      await helper.saveToken(tokenJson);
      //refresh token every 3600 secs
      setTimeout(() => setInterval(async function () {
        await swap_and_refresh_token()}, 3600000), 3600000);

      res.redirect("http://localhost:4000/api/game-control/token")
    } catch(err) {
      res.redirect('/#/error/invalid token');
    }
  });


  module.exports = router;