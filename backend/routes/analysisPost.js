//Start every route with these lines - connects with model
const router = require('express').Router();
let analysis = require('../models/analysis');
let analysisPost = require('../models/analysispost');
let user = require('../models/user');

const passport = require('passport');
const jwt = require('jsonwebtoken');
const passportConfig = require('../passport');
const { findById } = require('../models/acs');

const findScoreHistory = (username, score_history) => {
    for(let i in score_history) {
        if(score_history[i].user == username) {
            return i;
        }
    }
    return -1;
}

const isPostExist = (username, posts) => {
    for(i in posts) {
        if(posts[i].user == username) {
            return false;
        }
    }
    return true;
}

// request body: {_id: str, post: str}
//router.route('/').put(async (req, res) => {
router.route('/').put(passport.authenticate('jwt', { session: false }), async (req, res) => {
    //const username = req.body.username;
    const username = req.user.username;
    try {
        let cur_analysis = await analysis.findById({_id: req.body._id}).then(analysis => {return analysis});
        if(cur_analysis && cur_analysis.status == "open" && cur_analysis.users.includes(req.body.username) && req.body.post && req.body.post.length !== 0) {
            let cur_posts = await analysisPost.find({analysis: req.body._id}).then(posts => {return posts});
            if(isPostExist(username, cur_posts)) {
                let cur_post = new analysisPost({
                    analysis: cur_analysis,
                    user: username,
                    response: req.body.post,
                    averageScore: 0,
                    scoreCount: 0,
                    scoreCounts: [],
                    scoreHistory: []
                });
                for(let i = 0; i <= 100; i++) {
                    cur_post.scoreCounts.push(0);
                }
                cur_post.save();
                cur_analysis.responses.push(cur_post);
                cur_analysis.save();
                res.json({msg: "Post is saved."})
            } else {
                res.status(400).json({msg: "Bad request: user cannot submit multiple posts to one analysis."});
            }
        } else {
            res.status(400).json({msg: "Bad request: request body contains incorrect information."});
        }
    } catch(err) {
        res.status(400).json({msg: "Bas request"})
    }
});

//router.route('/:id/:username?').get((req, res) => {
router.route('/:id').get(passport.authenticate('jwt', { session: false }), (req, res) => {
    //const username = req.params.username;
    const username = req.user.username;
    analysisPost.find({analysis: req.params.id}).sort({"createdAt": "desc"}).then(posts => {
        let user_posts = [];
        let other_posts = [];
        for(let index in posts) {
            let cur_score_index = findScoreHistory(username, posts[index].scoreHistory);
            let score_history = null;
            if(cur_score_index != -1) {
                score_history = posts[index].scoreHistory[cur_score_index].score;
            }
            const cur_post = {
                _id: posts[index]._id,
                user: posts[index].user,
                content: posts[index].response,
                averageScore: posts[index].averageScore,
                histogram: posts[index].scoreCounts,
                createdAt: posts[index].createdAt,
                scoredHistory: score_history,
            }
            if(cur_post.user == username) {
                user_posts.push(cur_post);
            } else {
                other_posts.push(cur_post);
            }
        }
        analysis.findById({_id: req.params.id}).then(analysis => {
            res.json({
                userPosts: user_posts,
                otherPosts: other_posts,
                analysis: {
                    question: analysis.question,
                    status: analysis.status,
                    image: analysis.image,
                    tier: analysis.tier,
                    isUserInAnalysis: analysis.users.includes(username)
                }
            });
        }).catch(err => res.status(500).json({msg: "Internal servcie error", err: err}));
    }).catch(err => res.status(400).json({msg: "Bad request", err: err}));
});

//router.route('/random/:id/:limit').get((req, res) => {
router.route('/random/:id/:limit').get(passport.authenticate('jwt', { session: false }), (req, res) => {
    analysisPost.find({analysis: req.params.id}).sort({"scoreCount": "asc", "createdAt": "asc"}).limit(parseInt(req.params.limit)).then(posts => {
        let random_posts = [];
        for(index in posts) {
            const cur_post = {
                _id: posts[index]._id,
                user: posts[index].user,
                content: posts[index].response,
                averageScore: posts[index].averageScore,
                histogram: posts[index].scoreCounts,
                createdAt: posts[index].createdAt
            }
            random_posts.push(cur_post);
        }
        res.json({posts: random_posts});
    }).catch(err => res.status(400).json({msg: "Bad request", err: err}));
});

// request body: {_id: str, score: int}
//router.route('/score').put(async (req, res) => {
router.route('/score').put(passport.authenticate('jwt', { session: false }), async (req, res) => {
    const username = req.user.username;
    //const username = req.body.username;
    let cur_post = await analysisPost.findById({_id: req.body._id}).then(post => {return post})
        .catch(err => res.status(400).json({status: 400, msg: "Bad request", err: err}));
    if(cur_post && req.body.score >= 0 && req.body.score <=100 && Number.isInteger(req.body.score)) {
        let cur_analysis = await analysis.findById({_id: cur_post.analysis}).then(analysis => {return analysis})
            .catch(err => res.status(500).json({status: 500, msg: "Internal service err", err: err}));
        if(cur_post.user != username && cur_analysis.users.includes(username)) {
            let cur_score_index = findScoreHistory(username, cur_post.scoreHistory);
            if(cur_score_index != -1) {
                res.status(400).json({status: 400, msg: "Bad request: Not supposed to score a post twice."})
            } else {
                const new_score = {
                    user: username,
                    score: req.body.score
                }
                cur_post.scoreHistory.push(new_score);
                cur_post.averageScore = (cur_post.averageScore * cur_post.scoreCount + req.body.score)/(cur_post.scoreCount + 1);
                cur_post.scoreCount += 1;
                cur_post.scoreCounts.set(req.body.score, cur_post.scoreCounts[req.body.score] + 1);
                cur_post.save().then(res.json({status: 200, msg: "Score is posted."}))
                    .catch(err => res.status(500).json({status: 500, msg: "Internal service err", err: err}));
            }
        } else {
            res.status(400).json({status: 400, msg: "Bad request: current user cannot score this post"});
        }
    } else {
        res.status(400).json({status: 400, msg: "Bad request: request body contain incorrect information."});
    }
});

module.exports = router;