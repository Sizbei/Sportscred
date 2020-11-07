const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const triviaSchema = new Schema({
    question: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    answer: {
        type: String,
        required: true,
        unique: false,
        trim: true,
      },
    options: {
      type: [String],
      required: true,
      unique: false,
      trim: true,
    },
  }, {
    timestamps: true,
  });
const trivia = mongoose.model('trivia', triviaSchema);
module.exports = trivia;