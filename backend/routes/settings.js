//Start every route with these lines - connects with model
const router = require('express').Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const passportConfig = require('../passport');
let Profile = require('../models/profile');
let User = require('../models/user');
let Acs = require('../models/acs');

router.route('/profile/:username').get(passport.authenticate('jwt', {session : false}),(req, res) => {
  Profile.findOne({username: req.params.username})
    .then(user => res.json(user))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/profile/update').post(passport.authenticate('jwt', {session : false}),(req, res) => {
  Profile.findOne({username: req.body.username})
    .then(user => {
      user.status = req.body.status;
      user.about = req.body.about;
      user.interest = req.body.interest;
      user.image = req.body.image;
      user.save()
        .then(() => res.json('Profile updated!'))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/account/:username').get(passport.authenticate('jwt', {session : false}),(req, res) => {
  User.findOne({username: req.params.username})
    .then(user => res.json({email: user.email}))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/account/verifypass/:username/:password').get(passport.authenticate('jwt', {session : false}),(req, res) => {
  User.findOne({username: req.params.username, password: req.params.password})
    .then(user => {
      if(user){
        res.json({verified: true})
      } else {
        res.json({verified: false})
      }
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/account/emailexist/:username/:email').get(passport.authenticate('jwt', {session : false}),(req, res) => {
  User.findOne({email: req.params.email})
    .then(user => {
      if(user){
        res.json({verified: "exist"})
      } else {
        res.json({verified: "dne"})
      }
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/account/update/email').put(passport.authenticate('jwt', {session : false}),(req, res) => {
  User.findOneAndUpdate({username: req.body.username}, {email: req.body.email})
  .then(() => res.json("Email updated"))
  .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/account/update/password').put(passport.authenticate('jwt', {session : false}),(req, res) => {
  User.findOneAndUpdate({username: req.body.username}, {password: req.body.password})
  .then(() => res.json("Password updated"))
  .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/account/deactivate/:username').delete(passport.authenticate('jwt', {session : false}),(req, res) => {
  User.findOneAndRemove({username: req.params.username})
  .then(() => {
    Profile.findOneAndRemove({username: req.params.username})
    .then(() => {
      Acs.findOneAndRemove({username: req.params.username})
    })
  })
  .catch(err => res.status(400).json('Error: ' + err));
});


module.exports = router;