const { post } = require('jquery');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    commenter: {
        type: String,
        required: true
    },
    post: {
        type: Schema.ObjectId,
        required: true,
        ref: "post"
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
    totalReports: {
        type: Number,
        required: false,
        default: 0
    },
    reported: {
        type:[String],
        required: false,
        default: []
    }
},{
    timestamps:true
});

const comment = mongoose.model('comment', commentSchema);
module.exports = comment;