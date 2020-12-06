const mongoose = require('mongoose');

function validateTwoTeams (val) {
  return val.length == 2;
}

const Schema = mongoose.Schema;
const playoffSchema = new Schema({
  year: {
    type: String,
    required: true,
  },

  westernConference: {
    quarterfinals: [{
      teams: {
        type: [String],
        validate: validateTwoTeams,
      },
      games: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'game',
      },
      score: {
        type: [Number],
        validate: validateTwoTeams,
        default: [0,0],
      },
    }],
    semifinals: [{
      teams: {
        type: [String],
        validate: validateTwoTeams,
      },
      games: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'game',
      },
      score: {
        type: [Number],
        validate: validateTwoTeams,
        default: [0,0],
      },
    }],
    confinals: [{
      teams: {
        type: [String],
        validate: validateTwoTeams,
      },
      games: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'game',
      },
      score: {
        type: [Number],
        validate: validateTwoTeams,
        default: [0,0],
      },
    }]
  },

  finals: {
    teams: {
      type: [String],
      validate: validateTwoTeams,
    },
    games: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'game',
    },
    score: {
      type: [Number],
      validate: validateTwoTeams,
      default: [0,0],
    },
  },

  easternConference: {
    quarterfinals: [{
      teams: {
        type: [String],
        validate: validateTwoTeams,
      },
      games: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'game',
      },
      score: {
        type: [Number],
        validate: validateTwoTeams,
        default: [0,0],
      },
    }],
    semifinals: [{
      teams: {
        type: [String],
        validate: validateTwoTeams,
      },
      games: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'game',
      },
      score:{
        type: [Number],
        validate: validateTwoTeams,
        default: [0,0],
      },
    }],
    confinals: [{
      teams: {
        type: [String],
        validate: validateTwoTeams,
      },
      games: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'game',
      },
      score: {
        type: [Number],
        validate: validateTwoTeams,
        default: [0,0],
      },
    }]
  }

  }, {
    timestamps: true,
  });
const playoff = mongoose.model('playoff', playoffSchema);
module.exports = playoff;