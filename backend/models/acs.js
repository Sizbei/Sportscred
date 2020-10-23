//Start every model with this line
const mongoose = require('mongoose');

const acsSchema = new Schema({

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

  acsTotal: [{
    total: {
      type: Number,
      required: true,
      default: 0
    },
    triviaGamesPc: {
      type: Number,
      required: true,
      default: 0
    },
    analysisDebatePc: {
      type: Number,
      required: true,
      default: 0
    },
    picksPredicitonPc: {
      type: Number,
      required: true,
      default: 0
    },
    participationHistoryPc: {
      type: Number,
      required: true,
      default: 0
    }
  }]

})

const acs = mongoose.model('acs', acsSchema);
module.exports = acs;