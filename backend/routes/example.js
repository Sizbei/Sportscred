//Start every route with these lines - connects with model
const router = require('express').Router();
let Example = require('../models/example');

//get method
router.route('/').get((req, res) => {
  Example.find()
    .then(ex => res.json(ex))
    .catch(err => res.status(400).json('Error: ' + err));
});

//get by id method - note the colon in route
router.route('/:id').get((req, res) => {
    Example.findById(req.params.id)
      .then(ex => res.json(ex))
      .catch(err => res.status(400).json('Error: ' + err));
  });

//post method
router.route('/update/:id').post((req, res) => {
Example.findById(req.params.id)
    .then(ex => {
    ex.username = req.body.username;
    ex.save()
        .then(() => res.json('Example updated!'))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

//put method
router.route('/add').put((req, res) => {
  const username = req.body.username;
  const newExample = new Example({username});
  newExample.save()
    .then(() => res.json('example added!'))
    .catch(err => res.status(400).json('Error: ' + err));
});

//delete by id method
router.route('/:id').delete((req, res) => {
  Example.findByIdAndDelete(req.params.id)
    .then(() => res.json('Example deleted.'))
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;