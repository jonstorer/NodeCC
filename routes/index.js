
var cc = require('../ccApi'),
    cctype = require('../types');


// these are the route handling functions. Actual routes are 
// in the index.js of the applications and they call these 
// functions

exports.getAuthorization1_0 = function( req, res ){
  var searchCriteria = {};

  // if there was a transaction_id given then find it only
  // else find all of the authorizations
  if( req.params.id !== undefined ){
    searchCriteria.transaction_id = req.params.id;
  }

  // apply the query params to the search of the db -
  // loop throught the query and add them to the 
  // searchCriteria object that is passed to the 
  // search
  for( var attribute in req.query ){
    searchCriteria[attribute] = req.query[attribute];
  }

  // apply the correct transaction type to the query
  searchCriteria.transaction_type = cctype.AUTHORIZE;

  // run the CC api RunQuery function
  cc.runQuery( searchCriteria, function( err, records ){
    if( err ){
      console.log( err );
    } else {
      res.send( records );
      res.end();
    }
  });
}

exports.getRefund1_0 = function( req, res ){
  var searchCriteria = {};
  if( req.params.id !== undefined ){
    searchCriteria.transaction_id = req.params.id;
  }
  for( var attribute in req.query ){
    searchCriteria[attribute] = req.query[attribute];
  }
  searchCriteria.transaction_type = cctype.REFUND;
  cc.runQuery( searchCriteria, function( err, records ){
    if( err ){
      console.log( err );
    } else {
      res.send( records );
      res.end();
    }
  });
}

exports.getAuthReversal1_0 = function( req, res ){
  var searchCriteria = {};
  if( req.params.id !== undefined ){
    searchCriteria.transaction_id = req.params.id;
  }
  for( var attribute in req.query ){
    searchCriteria[attribute] = req.query[attribute];
  }
  searchCriteria.transaction_type = cctype.REVERSAL;
  cc.runQuery( searchCriteria, function( err, records ){
    if( err ){
      console.log( err );
    } else {
      res.send( records );
      res.end();
    }
  });
}

exports.getDeposit1_0 = function( req, res ){
  var searchCriteria = {};
  if( req.params.id !== undefined ){
    searchCriteria.transaction_id = req.params.id;
  }
  for( var attribute in req.query ){
    searchCriteria[attribute] = req.query[attribute];
  }
  console.log( cctype.DEPOSIT );
  searchCriteria.transaction_type = cctype.DEPOSIT;
  cc.runQuery( searchCriteria, function( err, records ){
    if( err ){
      console.log( err );
    } else {
      res.send( records );
      res.end();
    }
  });
}

exports.getVoid1_0 = function( req, res ){
  var searchCriteria = {};
  if( req.params.id !== undefined ){
    searchCriteria.transaction_id = req.params.id;
  }
  for( var attribute in req.query ){
    searchCriteria[attribute] = req.query[attribute];
  }
  searchCriteria.transaction_type = cctype.VOID;
  cc.runQuery( searchCriteria, function( err, records ){
    if( err ){
      console.log( err );
    } else {
      res.send( records );
      res.end();
    }
  });
}

exports.getAll1_0 = function( req, res ){
  var searchCriteria = {};
  if( req.params.id !== undefined ){
    searchCriteria.transaction_id = req.params.id;
  }
  for( var attribute in req.query ){
    searchCriteria[attribute] = req.query[attribute];
  }
  cc.runQuery( searchCriteria, function( err, records ){
    if( err ){
      console.log( err );
    } else {
      res.send( records );
      res.end();
    }
  });
}


exports.postAuthorization1_0 = function( req, res ){
  cc.Authorize( req.body, function( err, response_data ){
    if( err ){ 
      console.log( err );
    } else {
      if( response_data.response_code !== 1 ){
       res.status(400);
      }
      res.send( response_data );
      res.end();
    }
  });
}

exports.postRefund1_0 = function( req, res ){
  cc.Refund( req.body, function( err, response_data ){
    if( err ){
      console.log( err );
    } else {
      if( response_data.response_code !== 1 ){
        res.status(400);
      }
      res.send( response_data );
      res.end();  
    }
  }); 
}

exports.postAuthReversal1_0 = function( req, res ){
  cc.AuthReversal( req.body, function( err, response_data ){
    if( err ){
      console.log( err );
    } else {
      if( response_data.response_code !== 1 ){
        res.status(400);
      }
      res.send( response_data );
      res.end();
    }  
  });
}

exports.postDeposit1_0 = function( req, res ){
  cc.Deposit( req.body, function( err, response_data){
    if( err ){
      console.log( err );
    } else {
      if( response_data.response_code !== 1 ){
        res.status(400);
      }
      res.send( response_data );
      res.end();
    }  
  });
}

exports.postVoid1_0 = function( req, res ){
  cc.Void( req.body, function( err, response_data ){
    if( err ){
      console.log( err );
    } else {
      if( response_data.response_code !== 1 ){
        res.status(400);
      }
      res.send( response_data );
      res.end();
    }
  });
}
