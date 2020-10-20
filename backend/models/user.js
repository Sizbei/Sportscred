const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const userSchema = new Schema({
    email:{
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    username:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true,
        trim: true
    },
    dateOfBirth:{
        type: Date,
        required: true
    },
    favoriteSport:{
        type: String,
        required: true
    },
    highestLevelOfPlay:{
        type: String,
        required: true
    },
    favoriteTeam:{
        type: [String],
        required: true
    },
    sportInterest:{
        type: String,
        required: true
    },
    gender:{
        type: String,
        required: false
    },
    firstName:{
        type: String,
        required: false
    },
    lastName:{
        type: String,
        required: false
    },
    posts:{
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'post'
    },
    radar:{
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'user'
    },
    permissions:{
        type: String,
        required: true,
        default: "User"
    },
},{
    timestamps:true
});

const user = mongoose.model('user', userSchema);
module.exports = user;