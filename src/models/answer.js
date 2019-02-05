const mongoose = require('mongoose');

// define Answers schema
const Answer = new mongoose.Schema ({
    user_id: String,
    parent_question : String,
    answer  : String,
    answer_value: Number,
    preference : Number,
});

module.exports = mongoose.model('AnswerModel', Answer);
