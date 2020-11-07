//Start every route with these lines - connects with model
const router = require('express').Router();
let trivia = require('../models/trivia');
let acs = require('../models/acs');
let queue = require('../models/queue');

router.route('/joinQueue').post((req, res) => {
  const user = req.body.username;
  const acs = req.body.acs;

  queue.remove(queue.findOne({"payload.user": user})).exec();

  const join = new queue({
    startTime: null,
    endTime: null,
    createdOn: new Date(),
    priority: 1,
    payload: {
      user: user,
      acs: acs
    }
  })

  join.save()
    .then(() => {
      res.json("Joined queue")
    })
    .catch(err => res.status(400).json('Error: ' + err));

});

router.route('/leaveQueue').delete((req, res) => {
  queue.remove(queue.findOne({"payload.user": req.body.username}))
    .then(() => res.json("Left queue"))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/findMatch').put((req, res) => {
  queue.findOneAndUpdate({startTime: null, "payload.user": {"$ne": req.body.username}}, {startTime: null}, {sort: {createdOn: 1}, new: true})
    .then(opp => res.json(opp.payload.user))
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;