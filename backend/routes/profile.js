//Start every route with these lines - connects with model
const router = require('express').Router();
let Profile = require('../models/profile');
let Teams = require('../models/team');

//get method
router.route('/:username').get((req, res) => {
  Profile.findOne({username: req.params.username})
    .then(user => res.json(user))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:username/teams').get((req, res) => {
  console.log(req.query.teams);
  Teams.find().where('name').in(req.query.teams).exec()
    .then(teams => res.json(teams))
    .catch(err => res.status(400).json('Error: ' + err));
    
});

module.exports = router;