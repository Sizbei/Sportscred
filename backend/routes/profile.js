//Start every route with these lines - connects with model
const router = require('express').Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const passportConfig = require('../passport');
let Profile = require('../models/profile');
let Teams = require('../models/team');
let Acs = require('../models/acs');
const { isAssertionExpression } = require('typescript');

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

router.route('/:username/radarlist').get(passport.authenticate('jwt', {session : false}), async (req,res) => {
  Profile.findOne({username: req.params.username})
  .then(async (user) => {
    let tempAcs = 0;
    var tempPic = "";
    var radarList = [];
    for (var i = 0; i < user.radarList.length; i++) {
      tempAcs = await Acs.findOne({username:user.radarList[i]}).then(acs => {return acs.acsTotal.total});
      tempPic = await Profile.findOne({username: user.radarList[i]}).then(profile => {return profile.image});
        radarList[i] = {username: user.radarList[i], acs:tempAcs, profilePic:tempPic}
    }
    res.json({radarList: radarList})})
  .catch(err => res.status(400).json('Error: ' + err));
})

router.route('/:username/:viewing/checkRadar').get(passport.authenticate('jwt', {session : false}), async (req,res) => {
  await Profile.findOne({username:req.params.username}).then(async (user) => {
    var following = false;
    for (var i = 0; i < user.radarList.length; i ++) {
      if (user.radarList[i] === req.params.viewing) {
        following = true;
      }
    }
    res.json({"following":following})
  }).catch(err => res.status(400).json('Error ' + err));
})

router.route('/:username/addRadar').put(passport.authenticate('jwt', {session : false}), async (req, res) => {
  await Profile.updateOne({username: req.body.username}, {$push: {radarList:[req.body.viewing]}}).then(
    res.json("Added friend")
  ).catch(err => res.status(400).json('Error ' + err));
})

router.route('/:username/removeRadar').delete(passport.authenticate('jwt', {session : false}), async(req,res) => { 
  console.log(req.body)
  await Profile.updateOne({username: req.body.username}, {$pullAll: {radarList:[req.body.viewing]}}).then(
    res.json("Removed friend")
  ).catch(err => res.status(400).json('Error ' + err));
});

router.route('/:username/acs').get(passport.authenticate('jwt', {session : false}), async(req, res) => {
  await Acs.findOne({username:req.params.username}).then(
    (user) => {
      var acsChart = []
      acsChart[0] = {title: "Trivia & Games", value: user.acsTotal.triviaGames/user.acsTotal.total}
      acsChart[1] = {title: "Analysis & Debate", value: user.acsTotal.analysisDebate/user.acsTotal.total}
      acsChart[2] = {title: "Picks & Prediction", value: user.acsTotal.picksPrediction/user.acsTotal.total}
      acsChart[3] = {title: "Participation & History", value: user.acsTotal.participationHistory/user.acsTotal.total}
      var currentTime = Date.now()
      var toProcess = user.acsHistory.slice(Math.max(user.acsHistory.length - 5, 0))
      var newEditedAcsHistory = []
      for (var i = 0; i < toProcess.length; i++) {
        newEditedAcsHistory[i] = {category: toProcess[i].category, points: toProcess[i].points, date: dateDifference(currentTime, toProcess[i].date)}
      }
      var acs = {acsChart: acsChart, acsHistory: newEditedAcsHistory.reverse(), acsTotal:user.acsTotal.total}
      res.json(acs)
    }
  ).catch(err => res.status(400).json('Error ' + err));
})

function dateDifference(now,then) {
  var timeElapsedinSeconds = (now - then)/1000;
  var timeElapsedinMinutes =  timeElapsedinSeconds/60;
  if (timeElapsedinMinutes < 1) {
    return 'A few seconds Ago';
  }
  var timeElapsedinHours = timeElapsedinMinutes/60
  if (timeElapsedinHours < 1) {
    return Math.floor(timeElapsedinMinutes).toString() + " Minutes Ago"
  }
  var timeElapsedinDays = timeElapsedinHours/24
  if (timeElapsedinDays < 1) {
    return Math.floor(timeElapsedinHours).toString() + " Hours Ago"
  } 
  return Math.floor(timeElapsedinDays).toString() + " Days Ago"
}

module.exports = router;