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
  },
  interest: {
    type: String,
    required: false,
    unique: false,
    trim: true,
  },
  status: {
    type: String,
    required: false,
    unique: false,
    trim: true,
  },
  image: {
    type: String,
    required: false,
    unique: false,
    trim: true,
    default: 'https://thumbs.dreamstime.com/b/default-avatar-profile-image-vector-social-media-user-icon-potrait-182347582.jpg'
  },
  acs: {
    type: Number,
    required: true,
    unique: false,
    default: 0,
    trim: true
  },
}, {
  timestamps: true,
});
const profile = mongoose.model('profile', profileSchema);

//End every model with this line
module.exports = profile;