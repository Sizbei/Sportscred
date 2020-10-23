const router = require('express').Router();
let post = require('../models/post');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const passportConfig = require('../passport');

router.route("/add").post(passport.authenticate('jwt', {session : false}),(req, res) => {
    console.log(req.body);
    const poster = req.body.poster;
    const body = req.body.body;
    const newPost = new post({
        poster: poster,
        body: body
    });
    newPost.save().then(
        () => {res.json("Added Post")}
    ).catch((err) => {res.status(400).json("Error" + err)})
});

module.exports = router;