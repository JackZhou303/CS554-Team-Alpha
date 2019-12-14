const mongoCollections = require("../config/mongoCollections");
const profile  = mongoCollections.profile;
var mongodb = require('mongodb');
const uuid  = require("node-uuid");
let exportMethods={
    async checkId(id){
        let valid = false;
        if (!id) throw "You must provide an id to search for";
        if(typeof id != "string" && typeof id != "object"){
            throw "Id is not a string"
        }
        if(typeof id == "string")
        {
        // console.log(id)
            if (id.length == 12 || id.length == 24) {
                valid = /^[0-9a-fA-F]+$/.test(id);
            }
            if(!valid){
                throw "Not a valid string"
            }
            else{
            id = new mongodb.ObjectID(id);
            }
        }
        return id;
    },
    async getProfileById(id){
        id = await this.checkId(id);
        return profile().then(profileCollection=>{
            return profileCollection.findOne({_id:id}).then(profile=>{
                if(!profile) throw "Profile not found";
                return profile;
            });
        })
    },
    async getAllProfile(){
        const profileCollection = await profile();
        return await profileCollection.find({}).toArray();
    },
    async postProfile(profile){
        const profileCollection = await profile();
        const result = await profileCollection.insertOne(profile);
        return await this.getProfileById(result.insertedId);
    },
    async updateAProfile(profileId,profileObject){
        profileId = await this.checkId(profileId);
        const profileCollection = await profile();
        const updatedProfile = await profileCollection.findOneAndUpdate({ _id: profileId }, { '$set': profileObject }, { returnOriginal: false });
        if (!updatedProfile.value) {
            throw 'Updating a profile fails!';
        }
        return updatedProfile;
    }
}

module.exports = exportMethods;