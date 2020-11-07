const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const postSchema = new Schema({
    poster: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    likes: {
        type: Number,
        required: true,
        default: 0
    },
    upvoted: {
        type:[String],
        required: false,
        default: []
    },
    downvoted: {
        type:[String],
        required: false,
        default: []
    },
    comments: [{type: Schema.ObjectId, ref:"comment"}]
},{
    timestamps:true
});

const post = mongoose.model('post', postSchema);
module.exports = post;