const router = require('Express').Router();
let user = require('../models/user');

router.route('/').get((req, res) => {
    user.find()
      .then(ex => res.json(ex))
      .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/existingUsername').get((req,res) => {
    console.log(req);
    const username = req.query.username;
    console.log(username);
    user.findOne({username: username})
        .then((result) => {
            if (result) {
                res.json({"exists":true});
            } else {
                res.json({"exists":false});
            }
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/existingEmail').get((req, res) => {
    const email = req.query.email;
    user.findOne({email:email})
        .then((result) => {
            if (result) {
                res.json({"exists":true});
            } else {
                res.json({"exists":false});
            }
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) =>{
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;

    const age = req.body.age;
    const favoriteSport = req.body.favoriteSport;
    const highestLevelOfPlay = req.body.highestLevelOfPlay;
    const favoriteTeam = req.body.favoriteTeam;
    const sportInterest = req.body.sportInterest;

    const gender = req.body.gender;
    const lastName = req.body.lastName;
    const firstName = req.body.firstName;
    const imageURL = req.body.url;
    
    const newUser = new user({
        email: email,
        username: username,
        password: password,
        age: age,
        favoriteSport: favoriteSport,
        highestLevelOfPlay: highestLevelOfPlay,
        favoriteTeam: favoriteTeam,
        sportInterest: sportInterest,
        gender: gender,
        lastName: lastName,
        firstName: firstName,
        imageURL: imageURL
    })
    newUser.save()
        .then(() => res.json('Added User'))
        .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;