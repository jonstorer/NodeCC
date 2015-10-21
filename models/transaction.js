var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// this is what the database record will look
// like
var transSchema = new Schema(
  {
    transaction_type: String,
    card_number: String,
    expiration_date: Number,
    cvv: Number,
    name: String,
    address: String,
    postal_code: String,
    division: Number,
    transaction_id: Number,
    based_transaction_id: Number,
    response: String,
    response_code: Number,
    response_message: String,
    response_date: Date
  }
);

module.exports = mongoose.model( 'Transaction', transSchema );
