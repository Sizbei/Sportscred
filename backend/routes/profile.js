//Start every route with these lines - connects with model
const router = require('express').Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const passportConfig = require('../passport');
let Profile = require('../models/profile');
let Teams = require('../models/team');

//get method
router.route('/:username').get(passport.authenticate('jwt', {session : false}),(req, res) => {
  Profile.findOne({username: req.params.username})
    .then(user => res.json(user))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:username/teams').get(passport.authenticate('jwt', {session : false}),(req, res) => {
  Teams.find().where('name').in(req.query.teams.split(',')).exec()
    .then(teams => res.json(teams))
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;