const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const gameSchema = new Schema({
  team1: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'team',
  },
  team2: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'team',
  },
  result: {
    type: String,
  },
  type: {
    type: String,
    unique: false,
    required: true,
    enum : ['seasonal','playoff', 'playin']
  },
  gameDay: {
    type: Date,
  },
}, {
  timestamps: true,
});

const game = mongoose.model('game', gameSchema);
module.exports = game;