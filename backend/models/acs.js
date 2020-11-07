//Start every model with this line
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const acsSchema = new Schema({

  username: {
    type:String,
    unique:true,
    required:true
  },

  acsHistory: [{
    category: {
      type: String,
      required: true
    },
    points: {
      type: Number,
      required: true
    },
    date: {
      type: Date,
      required: true
    }
  }],

  acsTotal: {
    total: {
      type: Number,
      required: true,
      default: 0
    },
    triviaGames: {
      type: Number,
      required: true,
      default: 0
    },
    analysisDebate: {
      type: Number,
      required: true,
      default: 0
    },
    picksPrediction: {
      type: Number,
      required: true,
      default: 0
    },
    participationHistory: {
      type: Number,
      required: true,
      default: 0
    }
  }

})

const acs = mongoose.model('acs', acsSchema);
module.exports = acs;