//Start every route with these lines - connects with model
const router = require('express').Router();
let trivia = require('../models/trivia');
let acs = require('../models/acs');
let queue = require('../models/queue');
let headToHeadGame = require('../models/headtoheadgame');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const passportConfig = require('../passport');

// set the time limit for each trivia question, unit in sec
const timeLimit = 14;
// set the total number of question in one regular trivia
const questionCount = 10;
// set the total number of question prepared in one trivia game
const maxQuestionCount = questionCount + 1;

/*-------------FUNCTIONS FOR THE QUEUE-----------------------*/

router.route('/joinQueue').post((req, res) => {
  const user = req.body.username;
  const acs = req.body.acs;

  queue.remove({"payload.user": req.params.username}).exec()
    .then(() => {
      const join = new queue({
        startTime: null,
        endTime: null,
        createdOn: new Date(),
        priority: 1,
        payload: {
          user: user,
          acs: acs,
          opp: "",
          accept: false
        }
      })
    
      join.save()
        .then(() => {
          res.json("Joined queue")
        })
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error leaving queue: ' + err));
});

router.route('/leaveQueue/:username').delete((req, res) => {
  queue.remove(queue.find({"payload.user": req.params.username}))
  .then(() => res.json("Left queue"))
  .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/findMatch').put((req, res) => {

  queue.findOne({startTime: {"$ne": null}, "payload.user": req.body.username})
    .then(user => res.json(user.payload.opp))
    .catch(() => {
      queue.findOneAndUpdate({startTime: null, "payload.user": {"$ne": req.body.username}, "payload.accept": false}, {startTime: new Date()}, {sort: {createdOn: 1}, new: true})
      .then(opp => {
        console.log(opp.payload.user);
        queue.findOneAndUpdate({"payload.user": req.body.username}, {startTime: new Date(), "payload.opp": opp.payload.user}, {new: true}).then(test => console.log("test 1: ", test))
        queue.findOneAndUpdate({"payload.user": opp.payload.user}, {"payload.opp": req.body.username}, {new: true}).then(test => console.log("test 2: ", test))
        res.json(opp.payload.user)
      })
      .catch(err => res.json("not found"));
    })
});

function setIntervals(n, f, t) {
  var promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      if (n == 0) {
        resolve(false);
      }
      
      f()
      .then((d) => {
        if (d != null) {
          console.log("resolve true");
          resolve(true);
        } else {
          setIntervals(n - 1, f, t).then(d => {
            resolve(d);
          })
        }
      })
      .catch(() => {
        setIntervals(n - 1, f, t).then(d => {
          resolve(d);
        })
      })
    }, t)
  })
  return promise;
}

router.route('/createGame').post((req, res) => {
  
  // const d = await testfunc();
  // res.json(d);
  
  queue.findOneAndUpdate({startTime: {"$ne": null},  "payload.user": req.body.username}, {endTime: new Date(), "payload.accept": true}, {new: true})
  .then(user => {
    
      if(user){
        setIntervals(20, () => queue.findOne({startTime: {"$ne": null},  "payload.user": user.payload.opp, "payload.accept": true}), 500).then((d) => {
          if (d) {
            // Initialize instance
            const initReq = {
              body: {
                user: req.body.username,
                enemy: user.payload.opp
              }
            }            

            queue.findOne({"payload.user": user.payload.opp})
            .then(opp => {              
                if(user.endTime < opp.endTime){
                    init(initReq, res);
                } else {
                    setIntervals(1000, () => headToHeadGame.findOne({users: {$all: [user.payload.opp, req.body.username]}, status: 'open'}), 50)
                    .then(() => {
                      init(initReq, res)
                    })
                }
                
            }).then(() => queue.remove(queue.findOne({"payload.user": user.payload.opp})).exec())
            
                
          } else {
            user.startTime = null;
            user.endTime = null;
            user.payload.opp = "";
            user.payload.accept = false;
            user.markModified('startTime');
            user.markModified('endTime');
            user.markModified('payload.opp');
            user.markModified('payload.accept');
            user.save().then(() => res.json("Match Declined"));
            console.log("Match declined.");
            //joinQueue(req, res);
          }
        })
      } else {
        console.log("Unable to join game");
        res.json("Unable to join game");
        //joinQueue(req, res);
      }
      
    })
    .catch(err => res.json("Waiting 2"))
});

//-------------------------------------------------
// Supporting functions for head-to-head trivia game
//-------------------------------------------------

const acsUpdate = game => {
    const pointReward = 2;
    if(game.points[0] > game.points[1]) {
        game.acsChange = [pointReward, -pointReward];
    } else if(game.points[0] == game.points[1]) {
        game.acsChange = [0, 0];
    } else {
        game.acsChange = [-pointReward, pointReward];
    }
    console.log(game);
    return game;
}

const closeQuestion = game => {
    // find the trivia question relating with current question index
    const questionIndex = game.currentQuestionIndex;
    const curQuestion = game.questions[questionIndex];
    let winerIndex = 0;
    console.log('1-3-1: check if user1 response to question correctlty');
    if (curQuestion.responses[winerIndex].answer &&
        curQuestion.responses[winerIndex].accuracy) {
        console.log('1-3-2: user1 passed check and now check user2');
        if(curQuestion.responses[1].answer &&
            curQuestion.responses[1].accuracy) {
            console.log('1-3-3: user2 passed check and now compare the response times');
            // if both users submit responses and correct
            if(curQuestion.responses[winerIndex].responseTime > curQuestion.responses[1].responseTime){
                // and then if user 2 submit the response earlier
                console.log('1-3-4: user2 response faster');
                winerIndex = 1;
            }
            console.log('1-3-4: user1 response faster');
        }
    } else {
        console.log('1-3-6: user1 failed check and now check user2');
        if(curQuestion.responses[1].answer &&
            curQuestion.responses[1].accuracy) {
            // if only user2 submit the response and correct
            console.log('1-3-7: user2 passed ckeck');
            winerIndex = 1;
        } else {
            console.log('1-3-8: user2 failed check');
            winerIndex = -1;
        }
    }
    console.log('1-3-9: update points if there is a winner');
    // update the points
    if(winerIndex !== -1) {
        console.log('1-3-10: there is a winner');
        let cur_point = game.points[winerIndex] + 1;
        game.points.set(winerIndex, cur_point);
        console.log('1-3-11: winner point updated');
    }
    // move to next question
    if(game.currentQuestionIndex < questionCount - 1) {
        console.log('1-3-12: move to next question');
        game.currentQuestionIndex += 1;
        game.questions[game.currentQuestionIndex].startTime = new Date();
    } else {
        if (game.points[0] == game.points[1] && game.currentQuestionIndex == questionCount - 1) {
            console.log('1-3-13: move to extra question');
            game.currentQuestionIndex += 1;
            game.questions[game.currentQuestionIndex].startTime = new Date();
        } else {
            console.log('1-3-14: last question so close the trivia');
            game.status = 'close';
            console.log('1-3-15: update acs score');
            game = acsUpdate(game);
        }
    }
    return game;
}

// update and save the given head-to-head game document, retuen the updated document
const updateHeadToHeadDocument = game => {
    // find the trivia question relating with current question index
    const questionIndex = game.currentQuestionIndex;
    const curQuestion = game.questions[questionIndex];
    console.log('1-1: start updating the game document');
    // check if the start time of the current question exists
    if(curQuestion.startTime) {
        const cur_date = new Date();
        console.log('1-2: ckeck current time with timer');
        // check if the question is still in time limit
        if((cur_date - curQuestion.startTime)/1000 <= timeLimit) {
            // check if both users has submitted responses
            if (curQuestion.responses[0].answer && curQuestion.responses[1].answer) {
                console.log('1-3: timer is still on and both users have completed responses');
                game = closeQuestion(game);
                console.log('1-4: question is closed');
        }
        // if time limit reached, close the question
        } else {
            console.log('1-5: timer is out');
            game = closeQuestion(game);
            console.log('1-6: question is closed');
        }
    // if start time doesn't exist, set it to current time
    } else {
        console.log('1-7: start the timer on first question');
        game.questions[questionIndex].startTime = new Date();
    }
    return game;
}

const generateGameInstance = (game, user) => {
    const userIndex = game.users.indexOf(user);
    let enemyIndex = 0;
    if(userIndex == 0){
        enemyIndex = 1;
    }

    let gameInstance = {
        _id: game._id,
        status: game.status,
        users: {
            user: {
                username: game.users[userIndex],
                point: game.points[userIndex],
                acsChange: null,
                initAcs: game.initAcs[userIndex]
            },
            enemy: {
                username: game.users[enemyIndex],
                point: game.points[enemyIndex],
                acsChange: null,
                initAcs: game.initAcs[enemyIndex]
            }
        },
        curQuestionIndex: game.currentQuestionIndex,
        questions: []
    }

    // update is acsChange if it is in the game document
    if(game.acsChange.length != 0) {
        gameInstance.users.user.acsChange = game.acsChange[userIndex];
        gameInstance.users.enemy.acsChange = game.acsChange[enemyIndex];
    }

    for(i = 0; i <= game.currentQuestionIndex; i++) {
        let question = {
            triviaQuestion: game.questions[i].triviaQuestion,
            responses: {
                user: game.questions[i].responses[userIndex],
                enemy: game.questions[i].responses[enemyIndex],
            },
            startTime: game.questions[i].startTime
        }
        // hide information for current question to avoid cheating
        if(i == game.currentQuestionIndex && game.status == 'open') {
            question.triviaQuestion.answer = null;
            if(question.responses['user'].accuracy !== undefined) {
                question.responses['user'].accuracy = null;
            }
            question.responses['enemy'] = null;
        }
        gameInstance.questions.push(question);
    }

    return gameInstance;
}

//-------------------------------------------------
// Routes for head-to-head trivia game
//-------------------------------------------------

// a request to update the DB and respond back a updated snapshot of head-to-head trivia information in DB
// request format: {_id: str, user: str}
//router.route('/update').put((req, res) => {
router.route('/update').put(passport.authenticate('jwt', {session : false}),(req, res) => {

    const acsSave = game => {
        game.users.forEach(user => {
            acs.findOne({username: user})
            .then(userAcs => {
                const i = game.users.indexOf(user);

                let entry = {
                    category: "Trivia & Games",
                    points: game.acsChange[i],
                    date: new Date()
                }
                userAcs.acsHistory.push(entry);
                userAcs.acsTotal.total += game.acsChange[i];
                userAcs.acsTotal.triviaGames += game.acsChange[i];

                userAcs.save();
            })
        });
    }

    console.log('==============update===============');
    headToHeadGame.findById({_id: req.body._id})
        .then(game => {
        if(game && game.users.includes(req.body.user)) {
            if(game.status == 'open') {
                console.log('1: able to find the head to head game in DB');
                game = updateHeadToHeadDocument(game);
                console.log('2: game document updated');
                game.save()
                .then(() => {
                    console.log('3: game document saved');
                    try {
                        if(game.acsChange.length != 0) {
                            acsSave(game);
                            console.log('4: acs document saved');
                        }
                    } catch (err) {
                        return res.status(500).json({msg: 'Internal service error', err: err});
                    }
                    gameInstance = generateGameInstance(game, req.body.user);
                    res.json({msg: 'Document updated', gameInstance: gameInstance});
                })
                .catch(err => res.status(500).json({msg: 'Internal service error', err: err}));
            } else {
                gameInstance = generateGameInstance(game, req.body.user);
                res.json({msg: 'game is closed', gameInstance: gameInstance});
            }
        } else {
            res.status(400).json({msg: 'Bad request: request trivia game does not exist/open, or the given user is not in that trivia'});
        }
        })
        .catch(err => res.status(500).json({msg: 'Internal service error', err: err}));
});

// a request to submit trivia question answer to DB
// request format: {_id: str, username: str, answer: str}
//router.route('/submit').post((req, res) => {
router.route('/submit').post(passport.authenticate('jwt', {session : false}),(req, res) => {
    console.log('==============submit===============');
    headToHeadGame.findById({_id: req.body._id})
        .then(game => {
            if(game && game.status == 'open' && game.users.includes(req.body.username)) {
                console.log('1: game found');
                const userIndex = game.users.indexOf(req.body.username);
                const cur_date = new Date();
                if((cur_date - game.questions[game.currentQuestionIndex].startTime)/1000 <= timeLimit) {
                    console.log('2: response is on-time');
                    game.questions[game.currentQuestionIndex].responses[userIndex] = {
                        answer: req.body.answer,
                        responseTime: cur_date,
                        accuracy: game.questions[game.currentQuestionIndex].triviaQuestion.answer == req.body.answer
                    }
                    console.log('3: save the game');
                    game.save()
                    .then(() => res.json({msg: "Response submitted"}))
                    .catch(err => res.status(500).json({msg: 'Internal service error', err: err}));
                } else {
                    console.log('3: time is out');
                    res.json({msg: "submission failed: time is out"});
                }
            } else {
                res.status(400).json({
                    msg: 'Bad request: request trivia game does not exist/open, or the given user is not in that trivia'
                });
        }
        })
        .catch(err => res.status(500).json({msg: 'Internal service error', err: err}));
});

// init a head-to-head game
// request format: {user: str, enemy: str}
const init = (req, res) => {
  console.log("initiating trivia game");
    const shuffleOptions = options => {
        return options.sort(() => Math.random() - 0.5);
    }

    // try to find an open trivia using the given two usernamas
    headToHeadGame.findOne({users: {$all: [req.body.user, req.body.enemy]}, status: 'open'})
    .then(game => {
        acs.findOne({username: req.body.user})
        .then(userAcs => {
            acs.findOne({username: req.body.enemy})
            .then(enemyAcs => {
                if(userAcs && enemyAcs) {
                    if(game) {
                        res.json({msg: 'Head-to-head game exists', _id: game._id});
                    } else {
                        // get 10 random trivia question from DB and use them to init the game
                        trivia.aggregate([{$sample: {size: maxQuestionCount}}])
                        .then(trivias => {
                            let game = new headToHeadGame({
                                users: [req.body.user, req.body.enemy],
                                status: 'open',
                                points: [0, 0],
                                initAcs: [userAcs.acsTotal.total, enemyAcs.acsTotal.total],
                                currentQuestionIndex: 0,
                                questions: []
                            });
                            for (triviaIndex in trivias){
                                let curQuestion = {
                                    triviaQuestion: {
                                        question: trivias[triviaIndex].question,
                                        answer: trivias[triviaIndex].answer,
                                        options: shuffleOptions(trivias[triviaIndex].options)
                                    },
                                    responses: [{accuracy: false},{accuracy: false}]
                                }
                                game.questions.push(curQuestion);
                            }
                            game.save()
                            .then(() => res.json({msg: 'Head-to-head gamse initialized', _id: game._id}))
                            .catch(err => res.status(500).json({msg: 'Internal service error', err: err}));
                        })
                        .catch(err => res.status(500).json({msg: 'Internal service error', err: err}));
                    }
                } else {
                    res.status(400).json({msg: 'Bad request: user or enemy does not exist in DB collection-acs'})
                }
            })
            .catch(err => res.status(500).json({msg: 'Internal service error', err: err}));
        })
        .catch(err => res.status(500).json({msg: 'Internal service error', err: err}));
    })
    .catch(err => res.status(500).json({msg: 'Internal service error', err: err}));
}


module.exports = router;