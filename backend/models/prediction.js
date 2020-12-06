const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const predictionSchema = new Schema({
    game: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'game',
    },
    closeTime: {
        type: Date,
        unique: false,
        required: false,
    },
    type: {
        type: String,
        unique: false,
        required: true,
        enum : ['seasonal','playoff', 'playin']
    },
    status: {
        type: String,
        unique: false,
        required: true,
        enum : ['open','close']
    },
    acsStatus: {
        type: String,
        unique: false,
        required: true,
        enum : ['pend','close']
    },
    picks: [
        {
            user: {
                type: String,
                unique: false,
                required: true,
            },
            pick: {
                type: String,
                unique: false,
                required: true,
            }
        }
    ]
}, {
    timestamps: true,
});

const prediction = mongoose.model('prediction', predictionSchema);
module.exports = prediction;