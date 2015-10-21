
var TransactionSchema = require('../models/transaction'),
  TransIdSchema = require('../models/transid'),
  cardSchema = require('../models/card'),
  responseSchema = require('../models/response'),
  mongoose = require('mongoose'),
  cctype = require('../types.js');


exports.Authorize = function Authorize( request_data, callback ){

  var response_data = request_data;

  // get the previous transaction from the db
  var query = TransIdSchema.findOne();
  query.exec( function( err, trec ){
    if( err ){
      callback( err, null );
    } else {

      // set the transaction type
      request_data.transaction_type = cctype.AUTHORIZE;

      // increment the transaction id by 1
      trec.transaction_id = trec.transaction_id + 1;

      // look up the card in the table and respond based off of
      // configured values for the card
      var cardSearch = cardSchema.findOne({card_number: request_data.card_number});
      cardSearch.exec( function( err, cardRec ){
        if( err ){
          console.log( err );
        } else {
          var resp_id;
          if( cardRec === null ){
            // default is to decline
            resp_id = 2;
          } else {
            // found the value that was config'd for this card
            // get the id
            resp_id = cardRec.response_id;
          }
      
          // search the responses table for the id that we have and then apply 
          // the config'd response
          var responseSearch  = responseSchema.findOne({response_id: resp_id});
          responseSearch.exec( function( err, respRec ){ 
            if( err ){
              console.log( err );
            } 
            response_data.response_code = respRec.response_code;
            response_data.response_message = respRec.response_message
          
            // set this transaction id
            response_data.transaction_id=trec.transaction_id;

            // update the record in the transaction id table 
            // with the latest transaction id
            var trans_rec = new TransIdSchema( trec );
            trans_rec.update( trec, function( err, numUpdates ){
              if( err ){
                console.log( err );
              }
            })
        
            // save this transaction to the table
            var record = new TransactionSchema( response_data );
            record.save( function( err ){
              if( err ){
                console.log( err );
              }
            });
            // call back and let them know what the data was
            callback( null, response_data );
          });
        }
      });
    }
  });
};

exports.Refund = function Refund( request_data, callback ){

  var response_data = request_data;
  var query = TransIdSchema.findOne();
  query.exec( function( err, trec ){
    if( err ){
      callback( err, null );
    } else {
      response_data.transaction_type = cctype.REFUND;

      trec.transaction_id = trec.transaction_id + 1;
      // look up the card in the table and respond based off of
      // configured values for the card
      var cardSearch = cardSchema.findOne({card_number: request_data.card_number});
      cardSearch.exec( function( err, cardRec ){
        if( err ){
          console.log( err );
        } else {
          var resp_id;
          if( cardRec === null ){
            resp_id = 2;
          } else {
            resp_id = cardRec.response_id;
          }
      
          var responseSearch  = responseSchema.findOne({response_id: resp_id});
          responseSearch.exec( function( err, respRec ){ 
            if( err ){
              console.log( err );
            }

            response_data.response_code = cardRec.response_code;
            response_data.response_message = cardRec.response_message;
            response_data.transaction_id=trec.transaction_id;

            var trans_rec = new TransIdSchema( trec );
            trans_rec.update( trec,  function( err, numUpdates ){
              if( err ){
                console.log( err );
              }
            });

            var record = new TransactionSchema( response_data );
            record.save( function( err ){
              if( err ){
                console.log( err );
              }
            }); 
            callback( null, response_data );
          }); 
        }
      });
    }  
  });
};

exports.Deposit = function Deposit( request_data, callback ){

  var response_data = request_data;
  var query = TransIdSchema.findOne();
  query.exec( function( err, trec ){
    if( err ){
      callback( err, null );
    } else {
      response_data.transaction_type = cctype.DEPOSIT;

      trec.transaction_id = trec.transaction_id + 1;

      // if the transaction that this is based
      // on is an authorization then approve
      // otherwise fail

      var lookUpBasedTrans = 
          TransactionSchema.findOne({ "transaction_id" : 
                                      response_data.based_transaction_id });
      lookUpBasedTrans.exec( function( err, prevTrans ){
        if( err ){ 
          console.log( err );
        } else {
          if( prevTrans.transaction_type === cctype.AUTHORIZE && 
              prevTrans.response_code === 0 ){
            response_data.response_code=0;
            response_data.response_message="Approved";
          } else {
            response_data.response_code=2;
            response_data.response_message="Declined";
          }
          response_data.transaction_id=trec.transaction_id;

          var trans_rec = new TransIdSchema( trec );
          trans_rec.update( trec, function( err ){
            if( err ){
              console.log( err );
            }
          });
          var record = new TransactionSchema( response_data );
          record.save( function ( err ){
            if( err ){
              console.log( err );
            }
          });
          callback( null, response_data );      
        }
      });
    }
  });
};

exports.AuthReversal = function AuthReversal( request_data, callback ){

  var response_data = request_data;
  var query = TransIdSchema.findOne();
  query.exec( function( err, trec ){
    if( err ){
      callback( err, null );
    } else {
      response_data.transaction_type = cctype.REVERSAL;

      trec.transaction_id = trec.transaction_id + 1;

      var lookUpBasedTrans = 
          TransactionSchema.findOne( { "transaction_id" : 
                                        response_data.based_transaction_id });
      lookUpBasedTrans.exec( function ( err, prevTrans ){
        if( err ){
          console.log( err );
        } else {
          if( prevTrans.transaction_type === cctype.AUTHORIZE && 
              prevTrans.response_code === 0 ){
            response_data.response_code=0;
            response_data.response_message="Approved";
          } else {
            response_data.response_code=2;
            response_data.response_message="Declined";
          }
          response_data.transaction_id=trec.transaction_id;

          var trans_rec = new TransIdSchema( trec );
          trans_rec.update( trec, function( err ){
            if( err ){
              console.log( err );
            }
          });
          var record = new TransactionSchema( response_data );
          record.save( function( err ){
            if( err ){
              console.log( err );
            }
          });
          callback( null, response_data ); 
          }
      }); 
    }
  });
};


exports.Void = function Void( request_data, callback ){
  var response_data = request_data;

  var query = TransIdSchema.findOne();
  query.exec( function( err, trec ){
    if( err ){
      callback( err, null );
    } else {
      response_data.transaction_type = cctype.VOID;

      trec.transaction_id = trec.transaction_id + 1;
      var lookUpBasedTrans = 
          TransactionSchema.findOne( { "transaction_id" : 
                                        response_data.based_transaction_id });
      lookUpBasedTrans.exec( function( err, prevTrans ){
        if( err ){
          console.log( err );
        } else {
          if( prevTrans.transaction_type === cctype.DEPOSIT && 
              prevTrans.response_code === 0 ){
            response_data.response_code=0;
            response_data.response_message="Approved";
          } else {
            response_data.response_code=2;
            response_data.response_message="Declined";
          }
          response_data.transaction_id=trec.transaction_id;

          var trans_rec = new TransIdSchema( trec );
          trans_rec.update( trec,  function( err ){
            if( err ){
              console.log( err );
            }
          });

          var record = new TransactionSchema( response_data );
          record.save( function( err ){
            if( err ){
              console.log( err );
            }
          });
          callback( null, response_data );
        }
      });
    }
  });
};

exports.runQuery = function( searchCriteria, callback ){
  var query = TransactionSchema.find( searchCriteria );
  query.exec( function( err, records ){
    if( err ){
      callback( err, null );
    } else {
      callback( null, records );
    }
  });
}
