const mongoose = require('mongoose');

// define Questions schema
const Question = new mongoose.Schema ({
    question : String,
    answers: Array
});

module.exports = mongoose.model('QuestionModel', Question);