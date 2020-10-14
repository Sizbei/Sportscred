//Start every route with these lines - connects with model
const router = require('express').Router();
let Example = require('../models/profile');

//get method
router.route('/profile/:id').get((req, res) => {
  Example.find()
    .then(username => res.json(name))
    .then(about => res.json(about))
    .then(interest => res.json(interst))
    .then(status => res.json(status))
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;