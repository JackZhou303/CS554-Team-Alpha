# MusiXPlay

Music Quiz

## NOTE : As soon as you launch server, go to [http://localhost:4000/](http://localhost:4000/) and get your access token by logging in with spotify premium credentials. Then only you would be able to pass the loading screen (at client side) and enjoy the app.

## Installation

Use the package manager NPM  to install MusiXPlay. 

```bash
npm install
```
And to start the app, Run:

```bash
npm start
```


## SETUP INSTRUCTIONS

1. For server: - In the root directory of the project, run 
```bash
 npm install
```
to install dependencies and node_modules folder, for server. And once that is done you can run 

```bash 
 npm start
```

2. Similarly for Client:- In the /client directory of the project, where you can see package.json. Run the 
```bash 
 npm install
```
and then you can run 
```bash
 npm start
```

## VIDEO LINK
 Here is the link for the [video](https://youtube.com)

## WALKTHROUGH
As you see the application running, we have following features in here: 
1. Firebase Login
2. Spotify SDK
3. Voice Recognition (for speech into text conversions)
4. REDIS
5. User Profile

You will need to login to our system first. Also the tricky part is, since we are running spotify in here, you will need an access token for that. So to do that follow the next section

## SPOTIFY LOGIN/ACCESS TOKEN 
To run the service you will need an access token at server side. So as soon as you launched the server by running ```npm start```, you can see that server is running at port [4000](http://localhost:4000). 

#### You will have to initiate by hitting [4000/](http://localhost:4000/) which will take you to the spotify login url. Login yourself with a premium credentials and you will see the status response. And Now you would be able to play the game. We can provide you with our Spotify account. Otherwise, you will have to set up your own Spotify environment and change the credientials in .env file. Make sure you name your libraries as in "Demo1", "Demo2", and ""Demo3". We are giving cheatsheet of answer through logging outputs.

### Technologies:
1. Firebase AUTH
2. Firebase REALTIM-DATABASE
3. Firebase Cloud Datastore
4. Redis - for token saving
5. React - For front end
6. Bootstrap- As we all know
7. Voice Recognition
8. Spotify SDK


## Contributors
This project is done by Jack, Sid and Maria. It's a demonstration of mixing react, with firebase, spotify sdk like technologies and creating a whole REST API at the server side.

