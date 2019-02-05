// import node modules
const mongoose = require('mongoose');

// define Compatibility schema
const Compatibility = new mongoose.Schema ({
  users: Array,
  score: Number
});

// compile model from schema
module.exports = mongoose.model('Compatibility', Compatibility);

