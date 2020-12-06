//Start every route with these lines - connects with model
const router = require('express').Router();
let game = require('../models/game');
let team = require('../models/team');
let prediction = require('../models/prediction');

const passport = require('passport');
const jwt = require('jsonwebtoken');
const passportConfig = require('../passport');

//since games in DB are all historical data, use a demo date to represent current date
const demo_date = new Date(2020, 7, 5);

const findUserPick = (picks, user) => {
    for(let index in picks) {
        if(picks[index].user == user) {
            return picks[index];
        }
    }
    return null;
}

//req body: {_id: str, pick: str}
//router.route('/addPrediction').put(async (req, res) => {
router.route('/addPrediction').put(passport.authenticate('jwt', {session : false}), async (req, res) => {
    //const user = req.body.user;
    const user = req.user.username;
    const cur_date = demo_date; //since games in DB are all historical data, use a demo date to represent current date
    prediction.findById({_id: req.body._id}).then(prediction => {
        let cur_pick = null;
        if(!prediction || !req.body.pick) {
            res.status(400).json({err: "Bad request: invaild information in request"});
        } else if(prediction.closeTime < cur_date) {
            res.status(400).json({err: "Bad request: prediction for this game is closed"});
        } else if(cur_pick = findUserPick(prediction.picks, user)) {
            cur_pick.pick = req.body.pick;
            prediction.save();
            res.json({msg: "pick updated"})
        } else {
            cur_pick = {
                user: user,
                pick: req.body.pick
            }
            prediction.picks.push(cur_pick);
            prediction.save();
            res.json({msg: "pick submitted"})
        }
    }).catch(err => res.status(500).json({err: err}));
})

//req body: {games: [{team1: str, team2: str, result: str, year: int, month: int, day: int, type: str}]}
router.route('/addGames').put(async (req, res) => {
    for(let index in req.body.games){
        const cur_game = req.body.games[index];
        const team1 = await team.findOne({name: cur_game.team1}).then(team => {return team});
        const team2 = await team.findOne({name: cur_game.team2}).then(team => {return team});
        if(!team1) {
            res.status(400).json({err: cur_game.team1 + " does not exist"});
        }
        if(!team2) {
            res.status(400).json({err: cur_game.team2 + " does not exist"});
        }
        const g = new game({
            team1: team1,
            team2: team2,
            result: cur_game.result,
            type: cur_game.type,
            gameDay: new Date(cur_game.year, cur_game.month - 1, cur_game.day)
        })
        const p = new prediction({
            game: g,
            closeTime: g.gameDay,
            type: g.type,
            status: "open",
            acsStatus: "pend",
            picks: []
        })
        g.save();
        p.save();
    }
    res.json("done");
})

module.exports = router;