//Start every route with these lines - connects with model
const router = require('express').Router();
let Profile = require('../models/profile');

router.route('/profile').get((req, res) => {
  Profile.findOne({username: req.query.username})
    .then(user => res.json(user))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/profile/update').post((req, res) => {
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

module.exports = router;