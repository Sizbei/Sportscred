const router = require('express').Router();
let predictionPoints = require('../models/predictionPoints');
let profiles = require('../models/profile');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const passportConfig = require('../passport');

const divisions = [

  {max: 100, min: 91},
  {max: 90, min: 81},
  {max: 80, min: 71},
  {max: 70, min: 61},
  {max: 60, min: 51},
  {max: 50, min: 41},
  {max: 40, min: 31},
  {max: 30, min: 21},
  {max: 20, min: 11},
  {max: 10, min: 0}

]


async function divisonPromise(year, category, res) {

  var divisionThreshhold = [0,0,0,0,0,0,0,0,0,0];
  var divisionCounts = [0,0,0,0,0,0,0,0,0,0];
  var divisionPercentage = [0,0,0,0,0,0,0,0,0,0];
  

  const totalUsers = (await predictionPoints.aggregate([{$match: {year: year, category: category}}, {$project: {total: {$size: "$userPoints"}}}]))[0].total
  

  const values2 = Promise.all(
    divisions.map((division, index) => {

      return new Promise((resolve, reject) => {
        predictionPoints.aggregate([{$match: {year: year, category: category}}, 
          {$project: {
            divisionCount: {
              $size: {
                $filter: {
                  "input": "$userPoints", 
                  "as": "userPoints", 
                  "cond": {
                    "$and":[
                      {"$gte": ["$$userPoints.points", division.min]},
                      {"$lte": ["$$userPoints.points", division.max]}
                    ]
                  }}}}}}])
        .then(count => {
  
          divisionThreshhold[index] = division.max;
          divisionCounts[index] = count[0].divisionCount;
          divisionPercentage[index] = count[0].divisionCount / totalUsers * 100;
          /*console.log({
            divisionThreshhold: divisionThreshhold, 
            divisionCounts: divisionCounts, 
            divisionPercentage: divisionPercentage
          })*/
          resolve();

        })
        .catch(err => res.status(400).json({err: err}));
        
      })
    })

  )
  
    const getValues = async () => {
      return await values2;
    }

  
  getValues().then(() => {return( {
    divisionThreshhold: divisionThreshhold, 
    divisionCounts: divisionCounts, 
    divisionPercentage: divisionPercentage
  })})
  .then(result => res.json(result))
  .catch(err => res.status(400).json({err: err}));

}


async function returnGlobalLeaderboard(year, category, res){

  Promise.resolve()
    .then(() => {divisonPromise(year, category, res)})
    //.then(result => {console.log(result)})

}

function sortRadarRanking(user1, user2){
  
  if(user1.points > user2.points){
    return -1;
  }
  if(user1.points < user2.points){
    return 1;
  }
  return 0;
  
}

async function getProfilePicture(user, callback){

  profiles.findOne({username: user.user})
  .then(async userProfile => {
    await callback(userProfile.image)
  });

}

async function returnRadarLeaderboard(year, user, category, res){

  profiles.findOne({username: user})
  .then(async userProfile => {
    predictionPoints.findOne({year: year, category: category})
    .then(async pp => {
      var radarUsers = pp.userPoints.filter(function (entry) {return (userProfile.radarList.includes(entry.user) || entry.user === user)});
      
      var addMissingUsers = new Promise(async(resolve, reject) => {

        if(!radarUsers.some(e => e.user === user)){
          radarUsers.push({user: user, points: 0})
        }

        userProfile.radarList.forEach(async function(eachUser, index){
          if(!radarUsers.some(e => e.user === eachUser)){
            radarUsers.push({user: eachUser, points: 0})
          }

          if(index === userProfile.radarList.length - 1){
            resolve();
          }

        })

      });

      addMissingUsers.then(() => radarUsers.sort(sortRadarRanking));
      
      //radarUsers.sort(sortRadarRanking);

      const addPictures = new Promise(async (resolve, reject) => {

        radarUsers.forEach(async function(eachUser, index){
  
          getProfilePicture(eachUser, function(pic) {

          try{
            eachUser._doc.picture = pic;
          }catch{
            eachUser.picture = pic;
          }
          
          if(index === radarUsers.length - 1){
            console.log(radarUsers)
            resolve();
          }

        })
          
        });
      })
      .then(() => {res.json(radarUsers)})

    })
  })

}

router.route("/regularseason/global/:year").get(async(req, res) => {

  await returnGlobalLeaderboard(req.params.year, "regularSeason", res);
  
});

router.route("/regularseason/radarlist/:year/:user").get(async(req, res) => {

  await returnRadarLeaderboard(req.params.year, req.params.user, "regularSeason", res)

});

router.route("/playoff/global/:year").get(async(req, res) => {

  await returnGlobalLeaderboard(req.params.year, "playoff", res);

});

router.route("/playoff/radarlist/:year/:user").get(async(req, res) => {

  await returnRadarLeaderboard(req.params.year, req.params.user, "playoff", res)

});

router.route("/add/board").post((req, res) => {

  const year = req.body.year;
  const category = req.body.category;
  const userPoints = req.body.userPoints;

  predictionPoints.findOne({year: year, category: category})
  .then(found => {
    if(!found){
      const newPredictionPoints = new predictionPoints({
        year: year,
        category: category,
        userPoints: userPoints
      })

      newPredictionPoints.save()
        .then(() => {res.json("Document added")});

    } else {
      res.json("Document already exists")
    }

  })

});

router.route("/update").put((req, res) => {

  const year = req.body.year;
  const category = req.body.category;
  const user = req.body.user;
  const points = req.body.points;

  var options = {new: true, setDefaultsOnInsert: true, useFindAndModify: false};

  predictionPoints.findOneAndUpdate({year: req.body.year, category: req.body.category, userPoints: {$elemMatch: {user: user}}},
                                    {$inc: {"userPoints.$.points": points}},
                                    options)
  .then(pp => {
    if(!pp){

      const newUser = {
        user: user,
        points: points
      }

      predictionPoints.findOne({year: req.body.year, category: req.body.category})
      .then(pp2 => {
        pp2.userPoints.push(newUser);
        pp2.save().then(() => {res.json("Points updated")})
      })
    } else {
      res.json("Points updated")
    }
  })

});


module.exports = router;