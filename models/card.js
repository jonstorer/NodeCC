var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// this is what the database record will look
// like
var cardSchema = new Schema(
  {
    card_number: String,
    response_id: Number
  }
);

module.exports = mongoose.model( 'Card', cardSchema );
