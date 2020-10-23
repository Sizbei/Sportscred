const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const teamSchema = new Schema({
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3
    },
    image: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3
      }
  }, {
    timestamps: true,
  });
const team = mongoose.model('team', teamSchema);
module.exports = team;