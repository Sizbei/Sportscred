const router = require('express').Router();
let playoff = require('../models/playoff');
let game = require('../models/game');
let team = require('../models/team');
let prediction = require('../models/prediction');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const passportConfig = require('../passport');


const getTeam = async (teamName) => {
  return await team.findOne({name: teamName}).exec()
}


router.route("/:year/:team1/:team2").get(async(req, res) => {
  
  const year = req.params.year;
  const team1 = await getTeam(req.params.team1);
  const team2 = await getTeam(req.params.team2);

  game.find({
    type: "playoff",
    $or: [{team1: team1.id, team2: team2.id}, {team1: team2.id, team2: team1.id}], 
    gameDay: {
      $gte: new Date(year, 1, 1),
      $lte: new Date(year, 12, 31)
    }
  }).then(games => {
    var gameIds = []
    var score = [0,0]
    var result = ''

    games.forEach(async function(item, index){
      gameIds.push(item.id);
      if(item.result === team1.name){
        score[0]++;
        
      }else if(item.result === team2.name){
        score[1]++;
      }
    })

    console.log(score)

    if(score[0] == 4){
      result = team1.name;
    }else if(score[1] == 4){
      result = team2.name;
    }


    res.json({gameIds: gameIds, score: score, result: result});

  })
  .catch(() => {
    res.json({gameIds: [], score: [0,0], result: ''})})

});

router.route("/add/bracket").post((req, res) => {
  playoff.findOneAndDelete({year: req.body.year}).then(() => {
    
    const year = req.body.year;
    const easternConference = req.body.easternConference;
    const westernConference = req.body.westernConference;
    const finals = req.body.finals;
    
    const newPlayoff = new playoff({
      year: year,
      easternConference: easternConference,
      westernConference: westernConference,
      finals: finals,
    })

    newPlayoff.save()
      .then(() => {
        res.json("Playoff added")
      })
      .catch(err => res.status(400).json('Error: ' + err));

  })
});

router.route("/add/game").post(async(req, res) => {

  const result = req.body.result;
  const type = "playoff";
  const gameDay = new Date(req.body.gameDay);

  const team1 = await getTeam(req.body.team1);
  const team2 = await getTeam(req.body.team2);;

  game.findOneAndDelete({type: type,
                          $or: [{team1: team1.id, team2: team2.id}, {team1: team2.id, team2: team1.id}], 
                          gameDay: new Date(req.body.gameDay),
                          result: result
  }).then(oldGame => {

    if(oldGame){
      prediction.findByIdAndDelete({game: oldGame.id})
    }

    const newGame = new game({
      team1: team1.id,
      team2: team2.id,
      result: result,
      type: type,
      gameDay: gameDay,
    })

    newGame.save()
      .then(nG => {
        
        var status;
        if(gameDay > new Date()){
          status = "open";
        }else {
          status = "close";
        }

        var acsStatus;
        if(gameDay > new Date()){
          acsStatus = "pend";
        }else {
          acsStatus = "close";
        }

        const newPrediction = new prediction({
          game: nG.id,
          closeTime: gameDay,
          type: type,
          status: status,
          acsStatus: acsStatus,
          picks: []
        })

        newPrediction.save().then(() => {res.json("Game added")})
        
      })
      .catch(err => res.status(400).json('Error: ' + err));

  })

});

router.route("/delete/allgames/:year").delete(async(req, res) => {

  const year = req.params.year;

  game.deleteMany({type: "playoff", gameDay: {$gte: new Date(year, 1, 1), $lte: new Date(year, 12, 31)}})
  .then(() => {res.json("Games removed")})

});

module.exports = router;