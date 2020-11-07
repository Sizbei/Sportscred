//Start every model with this line
const mongoose = require('mongoose');

//Create necessary schemas 
const Schema = mongoose.Schema;
const profileSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  about: {
    type: String,
    required: false,
    unique: false,
    trim: true,
    maxlength: 300,
    default: ""
  },
  interest: {
    type: [String],
    required: false,
    unique: false,
    trim: true,
    default: []
  },
  status: {
    type: String,
    required: false,
    unique: false,
    trim: true,
    maxlength: 30,
    default: ""
  },
  image: {
    type: String,
    required: false,
    unique: false,
    trim: true,
    default: "https://png.pngtree.com/svg/20161027/631929649c.svg" 
  },
  radarList: {
    type: [String],
    unique: false
  }
}, {
  timestamps: true,
});
const profile = mongoose.model('profile', profileSchema);

//End every model with this line
module.exports = profile;