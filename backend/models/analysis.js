const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const analysisSchema = new Schema({

    question: {
        type: String,
        unique: false,
        required: true,
    },
    image: {
        type: String,
        required: false,
        unique: false,
        trim: true,
    },
    status: {
        type: String,
        unique: false,
        required: true,
        enum : ['open','close','pend'],
    },
    tier: {
        type: String,
        unique: false,
        required: true,
        enum : ['Fanalyst', 'Analyst', 'Pro Analyst', 'Expert Analyst'],
    },
    startTime: {
        type: Date,
        unique: false,
        required: true,
    },
    endTime: {
        type: Date,
        unique: false,
        required: true,
    },
    users: {
        type: [String],
        unique: false,
        required: false,
    },
    responses: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'analysispost'
    },

},{
    timestamps: true,
})

const analysis = mongoose.model('analysis', analysisSchema);
module.exports = analysis;