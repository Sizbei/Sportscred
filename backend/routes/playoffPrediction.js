const router = require('express').Router();
let playoff = require('../models/playoff');
let prediction = require('../models/prediction');
let game = require('../models/game');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const passportConfig = require('../passport');

router.route("/bracket/:year").post(passport.authenticate('jwt', {session : false}),(req, res) => {
  playoff.findOne({year: req.params.year}).then(bracket => res.json(bracket))
  .catch(err => res.status(400).json({err: err}));
});

router.route("/result/:gameId").get(passport.authenticate('jwt', {session : false}),(req, res) => {
  game.findOne({_id: req.params.gameId})
  .then(g => {
    res.json({result: g.result, open: g.gameDay > new Date()});
  })
  .catch(err => res.status(400).json({err: err}));
});

router.route("/pick/:user/:gameId").get(passport.authenticate('jwt', {session : false}),(req, res) => {
  prediction.findOne({game: req.params.gameId}).select({picks: { $elemMatch: {user: req.params.user} }})
  .then(p => {
    res.json({pick: p.picks[0].pick});
  })
  .catch(() => {res.json({pick: ''})});
});


router.route("/add").put((req, res) => {

  const user = req.body.user;
  const team = req.body.team;

  var options = {new: true, setDefaultsOnInsert: true, useFindAndModify: false};

  prediction.findOneAndUpdate({game: req.body.gameId, status: "open", picks: {$elemMatch: {user: user}}}, 
                              {$set: {"picks.$.pick": team}}, 
                                options)
  .then(p => {
    
    if(!p){
      const newPrediction = {
        user: user,
        pick: team
      }
      prediction.findOne({game: req.body.gameId, status: "open",})
      .then(p2 => {
        p2.picks.push(newPrediction);
        p2.save()
      })
    }

    console.log(p);
    //game.prediction.push(userPick);
    //game.save().then(() => res.json("Prediction added"));
    res.json(p)
  })
  
});


module.exports = router;