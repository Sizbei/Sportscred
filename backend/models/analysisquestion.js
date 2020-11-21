const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const analysisQuestionSchema = new Schema({

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
        default: "https://png.pngtree.com/svg/20161027/631929649c.svg" 
    },
    tier: {
        type: String,
        unique: false,
        required: true,
        enum : ['Fanalyst', 'Analyst', 'Pro Analyst', 'Expert Analyst'],
    }

})

const analysisQuestion = mongoose.model('analysisQuestion', analysisQuestionSchema);
module.exports = analysisQuestion;