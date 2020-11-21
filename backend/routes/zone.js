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

router.route('/display/:username/focused').get(passport.authenticate('jwt', { session: false }), async(req, res) => {
    var radarList = await Profile.findOne({username: req.params.username}).then((user) => {
        return user.radarList;
    });
    var recentPosts = await Post.find({poster: {$in: radarList}}).sort({'createdAt':'desc'}).then((post) => {
        return post;
    })
    console.log(post);
});

router.route('/display/:username').get(passport.authenticate('jwt', { session: false }), async(req, res) => {
    let recentPosts = await Post.find({}, "likes _id poster body upvoted downvoted reported" ).sort({'createdAt':'desc'}).limit(10).then(async (post) => {
        return post
    }).catch((err) => {res.status(400).json('Error ' + err)})
    let newPostsList = []
    for (var i = 0; i < recentPosts.length; i++) {
        let upvoted = recentPosts[i].upvoted.includes(req.params.username)
        let downvoted = recentPosts[i].downvoted.includes(req.params.username)
        let reported = recentPosts[i].reported.includes(req.params.username)
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
        newPost.poster.acs = acs
        newPost.body = recentPosts[i].body
        newPost.upvoted = upvoted
        newPost.downvoted = downvoted
        newPost.reported = reported
        newPostsList[i] = newPost
    }
    res.json({posts: newPostsList});
})

router.route('/display/:username/:post').get(passport.authenticate('jwt', { session: false }), async(req, res) => {
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
        newComment.commenter.acs = acs
        newComment.likes = comments[j].likes
        newComment.body = comments[j].body
        newComment.upvoted = comments[j].upvoted.includes(req.params.username);
        newComment.downvoted = comments[j].downvoted.includes(req.params.username);
        newComment.reported = comments[j].reported.includes(req.params.username)
        newComments[j] = newComment
    }
    let upvoted = singlePost.upvoted.includes(req.params.username)
    let downvoted = singlePost.downvoted.includes(req.params.username)
    let reported = singlePost.reported.includes(req.params.username)
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
    newPost.poster.acs = acs
    newPost.body = singlePost.body
    newPost.upvoted = upvoted
    newPost.downvoted = downvoted
    newPost.comments = newComments
    newPost.reported = reported
    res.json({posts: newPost});
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
router.route('/display/:username/reportedPosts/:page').get(async(req, res) => {
    let page = req.params.page
    let reports = await Post.count({totalReports:{$gt:0}}).then((total) => {
        return total
    }).catch((err) => {res.status(400).json('Error ' + err)})
    let recentPosts = await Post.find({totalReports:{$gt:0}}, "_id poster reported totalReports")
    .sort({'totalReports':'desc'})
    .skip(10*page)
    .limit(10)
    .then((posts) => {
        return posts
    }).catch((err) => {res.status(400).json('Error ' + err)})
    let newPostsList = []
    for (var i = 0; i < recentPosts.length; i++) {
        let newPost = {}
        newPost._id = recentPosts[i]._id
        newPost.totalReports = recentPosts[i].totalReports
        newPostsList[i] = newPost
    }
    res.json({posts: newPostsList, reports:reports});
})

router.route('/display/:username/reportedComments/:page').get(async(req, res) => {
    let page = req.params.page
    let reports = await Comment.count({totalReports:{$gt:0}}).then((total) => {
        return total
    }).catch((err) => {res.status(400).json('Error ' + err)})
    let recentComments = await Comment.find({totalReports:{$gt:0}}, "_id post commenter reported totalReports")
    .sort({'totalReports':'desc'})
    .skip(10*page)
    .limit(10)
    .then((comments) => {
        return comments
    }).catch((err) => {res.status(400).json('Error ' + err)})
    let newCommentsList = []
    for (var i = 0; i < recentComments.length; i++) {
        let newComment = {}
        newComment._id = recentComments[i]._id
        newComment.post = recentComments[i].post
        newComment.reports = recentComments[i].totalReports
        newCommentsList[i] = newComment
    }
    res.json({comments: newCommentsList, reports:reports});
})

router.route('/display/:username/deletePost').delete(async(req, res) => {
    await Post.deleteOne({_id: req.body._id}).then(async () => {
        await Comment.deleteMany({post: req.body._id}).then(() => {
            res.status(200).json("Deleted")
        }).catch((err) => {res.status(400).json('Error ' + err)})
    }).catch((err) => {res.status(400).json('Error ' + err)})
})

router.route('/display/:username/deleteComment').delete(async(req, res) => {
    await Comment.deleteOne({_id: req.body._id}).then(() => {
        res.status(200).json("Deleted")
    }).catch((err) => {res.status(400).json('Error ' + err)})
})

router.route('/display/clearPost').post(async(req, res) => {
    await Post.updateOne({_id: req.body._id}, {$set:{reported:[], totalReports:0}}).then(() => {
        res.status(200).json("cleared")
    }).catch((err) => {res.status(400).json('Error ' + err)})
})

router.route('/display/clearComment').post(async(req, res) => {
    await Comment.updateOne({_id: req.body._id}, {$set:{reported:[], totalReports:0}}).then(() => {
        res.status(200).json("Cleared")
    }).catch((err) => {res.status(400).json('Error ' + err)})
})

module.exports = router;