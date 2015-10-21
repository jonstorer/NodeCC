var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// this is what the database record will look
// like
var responseSchema = new Schema(
  {
    response_id: Number,
    response_code: Number,
    response_message: String
  }
);

module.exports = mongoose.model( 'Response', responseSchema );