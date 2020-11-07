const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const queueSchema = new Schema({
    startTime: {
      type: Date,
    },
    endTime: {
      type: Date,
    },
    createdOn: {
      type: Date,
    },
    priority: {
      type: Number,
    },
    payload: {
      type: Object,
    },
  }, {
    timestamps: true,
  });
const queue = mongoose.model('queue', queueSchema);
module.exports = queue;