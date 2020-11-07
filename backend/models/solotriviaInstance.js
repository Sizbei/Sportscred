const mongoose = require('mongoose');
const ObjectId = require('mongodb').ObjectID;

const Schema = mongoose.Schema;
const soloTriviaInstanceSchema = new Schema({
    user: {
      type: String,
      required: true,
      trim: true,
    },
    points: {
      type: Number,
      required: true,
      default: 0
    },
    correct: {
      type: Number,
      required: true,
      default: 0
    },
    questionIds: {
      type: [ObjectId],
      required: true,
      default: []
    },
    times: {
      type: [Date],
      required: true,
      default: []
    },
    inProgress: {
      type: Boolean,
      required: true,
      default: true
    }

  }, {
    timestamps: true,
  });
  
const soloTriviaInstance = mongoose.model('soloTriviaInstance', soloTriviaInstanceSchema);
module.exports = soloTriviaInstance;