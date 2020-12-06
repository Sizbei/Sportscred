const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const passportConfig = require('../passport');
let Post = require('../models/post')
let Comment = require('../models/comment')
let Profile = require('../models/profile')
let Acs = require('../models/acs')
const mongoose = require('mongoose');

router.route('/display/focused/:page/:sortedBy').get(passport.authenticate('jwt', { session: false }), async(req, res) => {
    var radarList = await Profile.findOne({username: req.user.username}).then((user) => {
        return user.radarList;
    });
    let sortedBy = req.params.sortedBy
    let page = req.params.page
    let recentPosts = null;
    let post_count = await Post.count({poster:{$in:radarList}}).then((total) => {
        return total
    }).catch((err) => {res.status(400).json('Error ' + err)})
    if (sortedBy === 'createdAt') {
        recentPosts = await Post.find({poster:{$in:radarList}}, "likes _id poster body upvoted downvoted reported" ).sort({'createdAt':'desc'}).skip(10*page).limit(10).then(async (post) => {
            return post
        }).catch((err) => {res.status(400).json('Error ' + err)})
    } else {
        recentPosts = await Post.find({poster:{$in:radarList}}, "likes _id poster body upvoted downvoted reported" ).sort({'likes':'desc'}).skip(10*page).limit(10).then(async (post) => {
            return post
        }).catch((err) => {res.status(400).json('Error ' + err)})
    }
    let newPostsList = []
    for (var i = 0; i < recentPosts.length; i++) {
        let upvoted = recentPosts[i].upvoted.includes(req.user.username)
        let downvoted = recentPosts[i].downvoted.includes(req.user.username)
        let reported = recentPosts[i].reported.includes(req.user.username)
        let newPost = {}
        newPost._id = recentPosts[i]._id
        newPost.likes = recentPosts[i].likes
        newPost.poster = {}
        newPost.poster.username = recentPosts[i].poster
        let image = await Profile.findOne({username: newPost.poster.username}, "image").then((user) => {
            return user.image
        }).catch((err) => {res.status(400).json('Error ' + err)})
        newPost.poster.image = image;
        let acs = await Acs.findOne({username: newPost.poster.username}, "acsTotal.total").then((acsobj) => {
            return acsobj.acsTotal.total
        }).catch((err) => {res.status(400).json('Error ' + err)})
        if (acs < 100) {
            acs = 100
        } else if (acs >= 1100) {
            acs = 1100
        }
        newPost.poster.acs = acs
        newPost.body = recentPosts[i].body
        newPost.upvoted = upvoted
        newPost.downvoted = downvoted
        newPost.reported = reported
        newPostsList[i] = newPost
    }
    res.json({posts: newPostsList, post_count: post_count});
});

router.route('/display/:page/:sortedBy').get(passport.authenticate('jwt', { session: false }), async(req, res) => {
    let post_count = await Post.count({}).then((total) => {
        return total
    }).catch((err) => {res.status(400).json('Error ' + err)})
    let sortedBy = req.params.sortedBy
    let page = req.params.page
    let recentPosts = null;
    if (sortedBy === 'createdAt') {
        recentPosts = await Post.find({}, "likes _id poster body upvoted downvoted reported" ).sort({'createdAt':'desc'}).skip(10*page).limit(10).then(async (post) => {
            return post
        }).catch((err) => {res.status(400).json('Error ' + err)})
    } else {
        recentPosts = await Post.find({}, "likes _id poster body upvoted downvoted reported" ).sort({'likes':'desc'}).skip(10*page).limit(10).then(async (post) => {
            return post
        }).catch((err) => {res.status(400).json('Error ' + err)})
    }

    let newPostsList = []
    for (var i = 0; i < recentPosts.length; i++) {
        let upvoted = recentPosts[i].upvoted.includes(req.user.username)
        let downvoted = recentPosts[i].downvoted.includes(req.user.username)
        let reported = recentPosts[i].reported.includes(req.user.username)
        let newPost = {}
        newPost._id = recentPosts[i]._id
        newPost.likes = recentPosts[i].likes
        newPost.poster = {}
        newPost.poster.username = recentPosts[i].poster
        let image = await Profile.findOne({username: newPost.poster.username}, "image").then((user) => {
            return user.image
        }).catch((err) => {res.status(400).json('Error ' + err)})
        newPost.poster.image = image;
        let acs = await Acs.findOne({username: newPost.poster.username}, "acsTotal.total").then((acsobj) => {
            return acsobj.acsTotal.total
        }).catch((err) => {res.status(400).json('Error ' + err)})
        if (acs < 100) {
            acs = 100
        } else if (acs >= 1100) {
            acs = 1100
        }
        newPost.poster.acs = acs
        newPost.body = recentPosts[i].body
        newPost.upvoted = upvoted
        newPost.downvoted = downvoted
        newPost.reported = reported
        newPostsList[i] = newPost
    }
    res.json({posts: newPostsList, post_count:post_count});
})

router.route('/addComment').post(passport.authenticate('jwt', { session: false }), async(req, res) => {
    const newComment = new Comment({
        commenter: req.body.commenter,
        post: req.body.post,
        body: req.body.body,
        likes: 0,
        upvoted: [],
        downvoted: []
    })
    newComment.save()
    .then(async(comment) => {
        await Post.findById(req.body.post)
        .then((post) => {
            post.comments.push(comment)
            res.status(200).json("Created Comment")
        })
        .catch(async (err) => {
            res.status(400).json('Error: ' + err)
        })
    })
    .catch((err) => {res.status(400).json('Error: ' + err)})
})

router.route('/upvote').put(passport.authenticate('jwt', { session: false }), async(req, res) => {
    //Handle Comments
    if (req.body.hasOwnProperty('comment') != 0) {
        if (req.body.upvoted) {
            await Comment.findOneAndUpdate({_id: req.body.comment}, {$pull: {upvoted: req.body.username}, $inc: {likes: -1}}, {new:true})
            .then((updated) => {res.status(200).json({upvoted:false, downvoted:false, likes:updated.likes})})
            .catch((err) => {
                res.status(400).json('Error: ' + err)
            })
        } else if (req.body.downvoted) {
            await Comment.findOneAndUpdate({_id: req.body.comment}, {$push: {upvoted: req.body.username}, $inc: {likes: 2}, $pull: {downvoted: req.body.username}}, {new:true})
            .then((updated) => {res.status(200).json({upvoted:true, downvoted:false, likes:updated.likes})})
            .catch((err) => {
                res.status(400).json('Error: ' + err)
            })
        } else {
            await Comment.findOneAndUpdate({_id: req.body.comment}, {$push: {upvoted: req.body.username}, $inc: {likes: 1}}, {new:true})
            .then((updated) => {res.status(200).json({upvoted:true, downvoted:false, likes:updated.likes})})
            .catch((err) => {
                res.status(400).json('Error: ' + err)
            })
        }
    //Handle Post
    } else if (req.body.hasOwnProperty('post') != 0) {
        if (req.body.upvoted) {
            await Post.findOneAndUpdate({_id: req.body.post}, {$pull: {upvoted: req.body.username}, $inc: {likes: -1}}, {new: true})
            .then((updated) => {res.status(200).json({upvoted:false, downvoted:false, likes:updated.likes})})
            .catch((err) => {
                res.status(400).json('Error: ' + err)
            })
        } else if (req.body.downvoted) {
            await Post.findOneAndUpdate({_id: req.body.post}, {$push: {upvoted: req.body.username}, $inc: {likes: 2}, $pull: {downvoted: req.body.username}}, {new:true})
            .then((updated) => {res.status(200).json({upvoted:true, downvoted:false, likes:updated.likes})})
            .catch((err) => {
                res.status(400).json('Error: ' + err)
            })
        } else {
            await Post.findOneAndUpdate({_id: req.body.post}, {$push: {upvoted: req.body.username}, $inc: {likes: 1}}, {new:true})
            .then((updated) => {res.status(200).json({upvoted:true, downvoted:false, likes:updated.likes})})
            .catch((err) => {
                res.status(400).json('Error: ' + err)
            })
        }
    } else {
        res.status(400).json('Missing Post or Comment Id')
    }
})

router.route('/downvote').put(passport.authenticate('jwt', { session: false }), async(req, res) => {
    //Handle Comments
    if (req.body.hasOwnProperty('comment') != 0) {
        if (req.body.upvoted) {
            await Comment.findOneAndUpdate({_id: req.body.comment}, {$pull: {upvoted: req.body.username}, $inc: {likes: -2}, $push:{downvoted: req.body.username}}, {new:true})
            .then((updated) => {res.status(200).json({upvoted:false, downvoted:true, likes:updated.likes})})
            .catch((err) => {
                res.status(400).json('Error: ' + err)
            })
        } else if (req.body.downvoted) {
            await Comment.findOneAndUpdate({_id: req.body.comment}, {$inc: {likes: 1}, $pull: {downvoted: req.body.username}}, {new:true})
            .then((updated) => {res.status(200).json({upvoted:false, downvoted:false, likes:updated.likes})})
            .catch((err) => {
                res.status(400).json('Error: ' + err)
            })
        } else {
            await Comment.findOneAndUpdate({_id: req.body.comment}, {$push: {downvoted: req.body.username}, $inc: {likes: -1}}, {new:true})
            .then((updated) => {res.status(200).json({upvoted:false, downvoted:true, likes:updated.likes})})
            .catch((err) => {
                res.status(400).json('Error: ' + err)
            })
        }
    //Handle Post
    } else if (req.body.hasOwnProperty('post') != 0) {
        if (req.body.upvoted) {
            await Post.findOneAndUpdate({_id: req.body.post}, {$pull: {upvoted: req.body.username}, $inc: {likes: -2}, $push:{downvoted: req.body.username}}, {new:true})
            .then((updated) => {res.status(200).json({upvoted:false, downvoted:true, likes:updated.likes})})
            .catch((err) => {
                res.status(400).json('Error: ' + err)
            })
        } else if (req.body.downvoted) {
            await Post.findOneAndUpdate({_id: req.body.post}, {$inc: {likes: 1}, $pull: {downvoted: req.body.username}}, {new:true})
            .then((updated) => {res.status(200).json({upvoted:false, downvoted:false, likes:updated.likes})})
            .catch((err) => {
                res.status(400).json('Error: ' + err)
            })
        } else {
            await Post.findOneAndUpdate({_id: req.body.post}, {$push: {downvoted: req.body.username}, $inc: {likes: -1}}, {new:true})
            .then((updated) => {res.status(200).json({upvoted:false, downvoted:true, likes:updated.likes})})
            .catch((err) => {
                res.status(400).json('Error: ' + err)
            })
        }
    } else {
        res.status(400).json('Missing Post or Comment Id')
    }
})

router.route("/reportPost").post(async(req, res) => {
    await Post.findOneAndUpdate({_id: req.body.post}, {$push:{reported:req.body.user}, $inc:{totalReports:1}}).then(() =>{
        res.status(200).json('Reported!')
    }).catch((err) => {
        res.status(400).json('Error: ' + err)
    })
})

router.route("/reportComment").post(async(req, res) => {
    await Comment.findOneAndUpdate({_id: req.body.comment}, {$push:{reported:req.body.user}, $inc:{totalReports:1}}).then(() =>{
        res.status(200).json('Reported!')
    }).catch((err) => {
        res.status(400).json('Error: ' + err)
    })
})

module.exports = router;