const router = require('express').Router();
let User = require('../models/user');

router.route('').get((req,res) => {
    const username = req.query.username;
    const password = req.query.password;
    User.findOne({username: username})
        .then((user) => {
            if (user.password == password) {
                res.json({"authenticated":true});
            } else {
                res.json({"authenticated":false});
            }
        })
        .catch(err => res.json({"authenticatd":false}));
});

  module.exports = router;