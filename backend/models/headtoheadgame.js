const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const headToHeadGameSchema = new Schema({
    users: {
        type: [String],
        unique: false,
        required: true,
    },
    status: {
        type: String,
        enum : ['open','close'],
        unique: false,
        required: true,
    },
    points: {
        type: [Number],
        unique: false,
        required: true,
    },
    acsChange: {
        type: [Number],
        unique: false,
        required: false,
    },
    initAcs: {
        type: [Number],
        unique: false,
        required: false,
    },
    currentQuestionIndex: {
        type: Number,
        unique: false,
        required: true
    },
    questions: [
        {
            triviaQuestion: {
                question: {
                    type: String,
                    required: true,
                    trim: true,
                },
                answer: {
                    type: String,
                    required: true,
                    trim: true,
                },
                options: {
                    type: [String],
                    required: true,
                    trim: true,
                }
            },
            responses: [
                {
                    answer: {
                        type: String,
                        unique: false,
                        required: false,
                    },
                    responseTime: {
                        type: Date,
                        unique: false,
                        required: false,
                    },
                    accuracy: {
                        type: Boolean,
                        unique: false,
                        required: false,
                    }
                }
            ],
            startTime: {
                type: Date,
                unique: false,
                required: false,
            },
        },
    ]
}, {
    timestamps: true,
});

const headToHeadGame = mongoose.model('headToHeadGame', headToHeadGameSchema);
module.exports = headToHeadGame;