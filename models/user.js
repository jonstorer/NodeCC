var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// this is what the database record will look
// like
var userSchema = new Schema(
  {
    userid: String
  }
);

module.exports = mongoose.model( 'User', userSchema );
