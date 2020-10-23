const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const passportConfig = require('../passport');
const User = require('../models/user');

// generate a token based on user id
const signToken = id => {
    return jwt.sign({
        iss: 'SportCred',
        sub: id
    }, "SportCredKey", {expiresIn: 3600 * 4});
};

router.route('/').post(passport.authenticate('local', {session : false}), (req, res) => {
    if (req.isAuthenticated()) {
        const id = req.user._id;
        const username = req.user.username;
        const email = req.user.email;
        const permissions = req.user.permissions;
        
        // assign the token and response
        const token = signToken(id);
        res.cookie("access_token", token, {httpOnly: true, sameSite: true});
        res.status(200).json({isAuthenticated: true,
            user:{username: username, email: email, permissions: permissions}});
    }
});

router.route('/authenticated').get(passport.authenticate('jwt', {session : false}), (req, res) => {
    const username = req.user.username;
    const email = req.user.email;
    const permissions = req.user.permissions;
    res.status(200).json({isAuthenticated: true,
        user:{username: username, email: email, permissions: permissions}});
});

//router.route('').get((req,res) => {
//    const username = req.query.username;
//    const password = req.query.password;
//    User.findOne({username: username})
//        .then((user) => {
//            if (user.password == password) {
//               res.json({"authenticated":true});
//            } else {
//                res.json({"authenticated":false});
//           }
//        })
//        .catch(err => res.json({"authenticatd":false}));
//});

  module.exports = router;