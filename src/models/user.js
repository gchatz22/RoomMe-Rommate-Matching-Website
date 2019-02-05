// import node modules
const mongoose = require('mongoose');

// define User schema
const UserModelSchema = new mongoose.Schema ({
  name      : String,
  googleid  : String,
  completed_form: Boolean,
  updatedQ  : Boolean,
  image     : String,
  altImage  : String,
  info      : Object

});

// compile model from schema
module.exports = mongoose.model('User', UserModelSchema);

