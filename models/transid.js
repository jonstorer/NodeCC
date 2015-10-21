var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// this is what the database record will look
// like
var transidSchema = new Schema(
  {
    transaction_id: Number
  }
);

module.exports = mongoose.model( 'Transid', transidSchema );
