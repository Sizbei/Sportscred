//Start every route with these lines - connects with model
const router = require('express').Router();
let Example = require('../models/profile');

//get method
router.route('/profile/:id').get((req, res) => {
  Example.findById(req.params.id)
    .then(user => res.json(user.username,
                            user.about,
                            user.interest,
                            user.status),)
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;