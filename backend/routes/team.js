const router = require('express').Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const passportConfig = require('../passport');
let Team = require('../models/team');

//get method
router.route('/').get((req, res) => {
    Team.find()
        .then((team) => res.json(team))
        .catch(err => res.status(400).json('Error: ' + err));
    // const name = req.body.name;
    // Team.findOne({name: name})
    //     .then((team) => res.json(team.image))
    //     .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;