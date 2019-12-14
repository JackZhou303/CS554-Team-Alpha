const redis = require("redis");
const client = redis.createClient();
const bluebird = require("bluebird");
bluebird.promisifyAll(redis);

module.exports={

    async saveToken(tokenJson) {
        try{
        //tokenJson as in token and refresh token
        await client.setAsync("Token", JSON.stringify(tokenJson))
        return;
        }
        catch(e){
            console.log(e)
            res.send({error: e.message})
          } 
        
    },

    async getToken(token_type) {
        try {
        //tokenJson as in token and refresh token
            let tokenJson = await client.getAsync("Token")
            let tokenObj= JSON.parse(tokenJson);
            return tokenObj[token_type]
        }
        catch(e) {
            console.log(e)
            res.send({error: e.message})
        }   
    }
}