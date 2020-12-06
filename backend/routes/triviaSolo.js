const router = require('express').Router();
const instance = require('../models/soloTriviaInstance');
const trivia = require('../models/trivia');
const acs = require('../models/acs');

const numQuestions = 10;

router.route('/create').post((req, res) => {

  const user = req.body.username;

  instance.remove({user: user, inProgress: true}).catch(err => res.status(400).json('Error: ' + err));

  const newGame = new instance({
    user: user
  })

  acs.findOne({username: user})
  .then(userACS => {
    newGame.save()
      .then(() => {
        res.json({instance: newGame.id, acs: userACS.acsTotal.total})
      })
      .catch(err => res.status(400).json('Error: ' + err));
  }).catch(err => res.status(400).json('Error: ' + err));

  
});

router.route('/next').put((req, res) => {


  instance.findOne({_id: req.body.instance})
  .then(game => {

    // console.log(game);

    const shuffle = (array) => {
      return array.sort(() => Math.random() - 0.5);
    }

    const sendRandom = (previousCorrect, previousAnswer) => {
      trivia.aggregate([
        { $match: { _id: { $nin: game.questionIds } } },
        { $sample: { size: 1 } } 
      ]).then(q => {
        const question = q[0];
        game.questionIds.push(question);
        game.times.push(new Date())
        game.save()
          .then(() => {
            res.json({ 
              gameOver: !game.inProgress,
              score: game.correct,
              currentQuestion: question.question, 
              options: shuffle(question.options), 
              previous: previousCorrect,
              previousAnswer: previousAnswer, 
              questionCount: game.questionIds.length,
              time: game.times[game.times.length - 1] })
          })
          .catch(err => res.status(403).json('Error: ' + err));
      }).catch(err => res.status(404).json('Error: ' + err));
    }

    const sendDone = (previous) => {
      acs.findOne({username: game.user})
      .then(userACS => 
      {
        const entry = {
          category: "Trivia & Games",
          points: game.points,
          date: new Date()
        }

        userACS.acsHistory.push(entry);
        userACS.acsTotal.total += game.points/10;
        userACS.acsTotal.triviaGames += game.points;
        
        game.inProgress = false;
        game.save().catch(err => res.status(400).json('Error: ' + err));

        userACS.save()
          .then(() => res.json({
            score: game.correct,
            gameOver: !game.inProgress, 
            acs: userACS.acsTotal.total, 
            points: game.points, 
            previous: previous}))
          .catch(err => res.status(400).json('Error: ' + err));

    }).catch(err => res.status(401).json('Error: ' + err));
    }

    const checkTime = (time) => {
      const curTime = new Date();
      if(curTime - time < 13000){
        return true;
      }
      return false;

    }

    if(game.questionIds.length > 0 && game.inProgress){
      trivia.findOne({question: req.body.question})
        .then(response => {
          if(response.answer === req.body.answer && checkTime(game.times[game.times.length - 1])){
            game.points += 1;
            game.correct += 1;
            game.save().then(() => {
              if (game.questionIds.length < numQuestions) {
                sendRandom("correct", response.answer)
              } else {
                sendDone("correct", response.answer)
              }
            }); 
          } else {
            game.points -= 1;
            game.save().then(() => {
              if (game.questionIds.length < numQuestions) {
                sendRandom("wrong", response.answer)
              } else {
                sendDone("wrong", response.answer)
              }
            });
          }
        }).catch(err => res.status(402).json('Error: ' + err));
    } else {
      sendRandom("none");
    }
      
    
  }).catch(err => res.status(405).json('Error: ' + err));
});

router.route('/add').post((req, res) => {
  const question = req.body.question;
  const answer = req.body.answer;
  const options = req.body.options;

  const newTrivia = new trivia({
    question: question,
    answer: answer,
    options: options
  })

  newTrivia.save()
    .then(() => {
      res.json("Trivia added")
    })
    .catch(err => res.status(400).json('Error: ' + err));

});

module.exports = router;