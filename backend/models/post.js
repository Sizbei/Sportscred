const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const postSchema = new Schema({
    poster: {
        type: ObjectID,
        ref: "user",
        required: true
    },
    body: {
        type: String,
        required: true
    },
    likes: {
        type: number,
        required: true,
        default: 0
    },
    interacted: {
        type:[{ObjectID, ref:"user"}]
    },
    comments: {
        type:[{ObjectID, ref:"comment"}]
    }
},{
    timestamps:true
});

const post = mongoose.model('post', postSchema);
module.exports = post;