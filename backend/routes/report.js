const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const passportConfig = require('../passport');
let Post = require('../models/post')
let Comment = require('../models/comment')
const mongoose = require('mongoose');

router.route('/reportedPosts/:page').get(async(req, res) => {
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

router.route('/reportedComments/:page').get(async(req, res) => {
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

router.route('/deletePost').delete(async(req, res) => {
    await Post.deleteOne({_id: req.body._id}).then(async () => {
        await Comment.deleteMany({post: req.body._id}).then(() => {
            res.status(200).json("Deleted")
        }).catch((err) => {res.status(400).json('Error ' + err)})
    }).catch((err) => {res.status(400).json('Error ' + err)})
})

router.route('/deleteComment').delete(async(req, res) => {
    await Comment.deleteOne({_id: req.body._id}).then(() => {
        res.status(200).json("Deleted")
    }).catch((err) => {res.status(400).json('Error ' + err)})
})

router.route('/clearPost').post(async(req, res) => {
    await Post.updateOne({_id: req.body._id}, {$set:{reported:[], totalReports:0}}).then(() => {
        res.status(200).json("cleared")
    }).catch((err) => {res.status(400).json('Error ' + err)})
})

router.route('/clearComment').post(async(req, res) => {
    await Comment.updateOne({_id: req.body._id}, {$set:{reported:[], totalReports:0}}).then(() => {
        res.status(200).json("Cleared")
    }).catch((err) => {res.status(400).json('Error ' + err)})
})

module.exports = router;