var express = require('express');
const app = express();
var cors = require("cors");


var SpotifyWebApi = require('spotify-web-api-node');
scopes = ['streaming','user-read-private', 'user-read-email','playlist-modify-public','playlist-modify-private']

require('dotenv').config();
app.use(cors());
app.use(express.json());

// credentials are optional
let spotifyApi = new SpotifyWebApi({
    clientId: '3cc049e06d534a8b853a48d4792ac432',
    clientSecret: '697ff37969b04b41bfa1ea60de4a0038',
    redirectUri: "http://localhost:3000/callback",
})


let my_client_id = '3cc049e06d534a8b853a48d4792ac432';
let redirect_uri= "http://localhost:3000/callback";
let token;

app.get('/home', async (req, res) => {
    // const data= await spotifyApi.getAudioFeaturesForTrack('3Qm86XLflmIXVm1wcwkgDK')
    // console.log(data.body.track_href)
    // //res.json({status: "ok"});
    // res.redirect(data.body.track_href);

    res.send({token: token})
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
    console.log(code)
    try {
      var data = await spotifyApi.authorizationCodeGrant(code)
      //console.log(data)
      const { access_token, refresh_token } = data.body;
      spotifyApi.setAccessToken(access_token);
      spotifyApi.setRefreshToken(refresh_token);
  
      token=access_token;
      res.redirect("http://localhost:3001/game")
    } catch(err) {
      res.redirect('/#/error/invalid token');
    }
  });

app.listen(3000, ()=> {
    console.log("The Server is running on port 3000");
});