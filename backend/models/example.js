//Start every model with this line
const mongoose = require('mongoose');

//Create necessary schemas 
const Schema = mongoose.Schema;
const exampleSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3
  },
}, {
  timestamps: true,
});
const example = mongoose.model('Example', exampleSchema);

//End every model with this line
module.exports = example;