const router = require('express').Router();
let Post = require('../models/post');
let Comment = require('../models/comment');
let Profile = require('../models/profile')
let Acs = require('../models/acs')
const passport = require('passport');
const jwt = require('jsonwebtoken');
const passportConfig = require('../passport');

router.route("/add").post(passport.authenticate('jwt', {session : false}),(req, res) => {
    console.log(req.body);
    const poster = req.body.poster;
    const body = req.body.body;
    const newPost = new Post({
        poster: poster,
        body: body
    });
    newPost.save().then(
        () => {res.json("Added Post")}
    ).catch((err) => {res.status(400).json("Error" + err)})
});

router.route('/display/post/:post').get(passport.authenticate('jwt', { session: false }), async(req, res) => {
    let singlePost = await Post.findById(req.params.post).then(async (post) => {
        return post
    }).catch((err) => {res.status(400).json('Error ' + err)})
    let newComments = []
    let comments = await Comment.find({post: req.params.post}, "commenter _id body likes upvoted downvoted reported").sort({'likes':'desc', 'createdAt': 'desc'}).then((comment) => {
        return comment;
    }).catch((err) => {res.status(400).json('Error ' + err)})
    for (var j = 0; j < comments.length; j++) {
        let newComment = {}
        newComment._id = comments[j]._id
        newComment.commenter = {}
        newComment.commenter.username = comments[j].commenter
        let image = await Profile.findOne({username: newComment.commenter.username}, "image").then((user) => {
            return user.image
        }).catch((err) => {res.status(400).json('Error ' + err)})
        newComment.commenter.image = image
        let acs = await Acs.findOne({username: newComment.commenter.username}, 'acsTotal.total').then((acsobj) => {
            return acsobj.acsTotal.total
        }).catch((err) => {res.status(400).json('Error ' + err)})
        if (acs < 100) {
            acs = 100
        } else if (acs >= 1100) {
            acs = 1100
        }
        newComment.commenter.acs = acs
        newComment.likes = comments[j].likes
        newComment.body = comments[j].body
        newComment.upvoted = comments[j].upvoted.includes(req.user.username);
        newComment.downvoted = comments[j].downvoted.includes(req.user.username);
        newComment.reported = comments[j].reported.includes(req.user.username)
        newComments[j] = newComment
    }
    let upvoted = singlePost.upvoted.includes(req.user.username)
    let downvoted = singlePost.downvoted.includes(req.user.username)
    let reported = singlePost.reported.includes(req.user.username)
    let newPost = {}
    newPost._id = singlePost._id
    newPost.likes = singlePost.likes
    newPost.poster = {}
    newPost.poster.username = singlePost.poster
    let image = await Profile.findOne({username: newPost.poster.username}, "image").then((user) => {
        return user.image
    }).catch((err) => {res.status(400).json('Error ' + err)})
    newPost.poster.image = image;
    let acs = await Acs.findOne({username: newPost.poster.username}, 'acsTotal.total').then((acsobj) => {
        return acsobj.acsTotal.total
    }).catch((err) => {res.status(400).json('Error ' + err)})
    if (acs < 100) {
        acs = 100
    } else if (acs > 1100) {
        acs = 1100
    }
    newPost.poster.acs = acs
    newPost.body = singlePost.body
    newPost.upvoted = upvoted
    newPost.downvoted = downvoted
    newPost.comments = newComments
    newPost.reported = reported
    res.json({posts: newPost});
})


module.exports = router;