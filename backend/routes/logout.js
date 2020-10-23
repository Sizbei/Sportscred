const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const passportConfig = require('../passport');

router.route('/').get(passport.authenticate('jwt', {session : false}), (req, res) => {
    res.clearCookie('access_token');
    res.status(200).json({user: {username: "", email: "", permissions: ""}, success: true});
});

module.exports = router;