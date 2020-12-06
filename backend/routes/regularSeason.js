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

const findStartAndEndDate = (cur_date, week_start, week_end) => {
    const cur_year = cur_date.getFullYear();
    const cur_month = cur_date.getMonth();
    const cur_day = cur_date.getDate();
    const cur_day_inweek = cur_date.getDay();
    const start_date = new Date(cur_year, cur_month, cur_day - (cur_day_inweek) + (week_start * 7) + 1);
    const end_date = new Date(cur_year, cur_month, cur_day + (6 - cur_day_inweek) + (week_end * 7) + 2);
    return {
        startDate: start_date,
        endDate: end_date
    }
}

const generateResponseFromPrediction = async (predictions, user, cur_date) => {
    const response = [];
    for(let index in predictions) {
        const cur_game = await game.findOne({_id: predictions[index].game}).then(game => {return game});
        const team1 = await team.findOne({_id: cur_game.team1}).then(team => {return team});
        const team2 = await team.findOne({_id: cur_game.team2}).then(team => {return team});
        let cur_prediction = {
            _id: predictions[index]._id,
            team1Name: team1.name,
            team1Image: team1.image,
            team2Name: team2.name,
            team2Image: team2.image,
            gameDay: cur_game.gameDay,
            result: null,
            pick: null
        }
        if(cur_game.gameDay <= cur_date) {
            cur_prediction.result = cur_game.result;
        }
        let cur_pick = null;
        if(cur_pick = findUserPick(predictions[index].picks, user)) {
            cur_prediction.pick = cur_pick.pick;
        }
        response.push(cur_prediction);
    }
    return response;
}

//router.route('/current/:username').get(async (req, res) => {
router.route('/current').get(passport.authenticate('jwt', {session : false}), async (req, res) => {
    //const user = req.params.username;
    const user = req.user.username;
    const cur_date = demo_date; //since games in DB are all historical data, use a demo date to represent current date
    const end_date = findStartAndEndDate(cur_date, 0, 0).endDate;
    prediction.find({$and: [{closeTime: {$gte: cur_date}},{closeTime: {$lt: end_date}}, {type: "seasonal"}]}).then(async predictions => {
        res.json({currentSeasonals: await generateResponseFromPrediction(predictions, user, cur_date)});
    }).catch(err => res.status(500).json({err: err}));
})

//router.route('/past/:username').get(async (req, res) => {
router.route('/past').get(passport.authenticate('jwt', {session : false}), async (req, res) => {
    //const user = req.params.username;
    const user = req.user.username;
    const cur_date = demo_date; //since games in DB are all historical data, use a demo date to represent current date
    const start_date = findStartAndEndDate(cur_date, 0, 0).startDate;
    prediction.find({$and: [{closeTime: {$gte: start_date}},{closeTime: {$lt: cur_date}}, {type: "seasonal"}]}).then(async predictions => {
        res.json({pastSeasonals: await generateResponseFromPrediction(predictions, user, cur_date)});
    }).catch(err => res.status(500).json({err: err}));
})

//router.route('/week/:weekNumber/:username').get(async (req, res) => {
router.route('/week/:weekNumber').get(passport.authenticate('jwt', {session : false}), async (req, res) => {
    //const user = req.params.username;
    const user = req.user.username;
    const cur_date = demo_date; //since games in DB are all historical data, use a demo date to represent current date
    const period = findStartAndEndDate(cur_date, req.params.weekNumber, req.params.weekNumber);
    prediction.find({$and: [{closeTime: {$gte: period.startDate}},{closeTime: {$lt: period.endDate}}, {type: "seasonal"}]}).then(async predictions => {
        res.json({Seasonals: await generateResponseFromPrediction(predictions, user, cur_date)});
    }).catch(err => res.status(500).json({err: err}));
})

router.route('/profile/:username').get(passport.authenticate('jwt', {session : false}), async (req, res) => {
    const user = req.params.username;
    const cur_date = demo_date; //since games in DB are all historical data, use a demo date to represent current date
    prediction.find({'picks.user':user})
    .then(async (predictions) => {
        console.log(predictions)
        res.json({Seasonals: await generateResponseFromPrediction(predictions, user, cur_date)});
    }).catch(err => res.status(500).json({err: err}));
})


module.exports = router;