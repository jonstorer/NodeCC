
var userSchema = require('../models/user');

exports.validateUser = function( req, res, next ){

  // takes the userToken - found in the headers and 
  // looks the value up in the users collection to see
  // if that user has access to our system
  var query = userSchema.findOne({"user": req.get('userToken')});
  query.exec( function( err, userid ){
    if( err ){
      res.status(401).send({error:401,error_message:"Unauthorized."});
      console.log( err );
    } else {
      if( userid === null ){
        res.status(401).send({error:401,error_message:"Unauthorized."});
      } else {
        next();
      }
    }
  });
}

exports.changeHeader = function( req, res, next ){
  res.set('X-Powered-By','creditCardAPI');
  next();
}

exports.setDefaults = function( req, res, next ){
  res.set('Content-Type','application/json');
  res.status(200);
  next();
}
