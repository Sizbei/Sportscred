const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const predictionPointsSchema = new Schema({
    year: {
      type: String,
    },
    category: {
      type: String,
      enum: ["regularSeason", "playoff"]
    },
    userPoints: [{
      user: {
        type: String
      },
      points: {
        type: Number
      }
    }]
  }, {
    timestamps: true,
  });
const predictionPoints = mongoose.model('predictionPoints', predictionPointsSchema);
module.exports = predictionPoints;