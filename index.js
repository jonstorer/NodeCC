var express = require('express'),
    routes = require('./routes'),
    mw = require('./mw'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose');

var app = express();
app.disable('X-Powered-By');
mongoose.connect("mongodb://localhost/CreditCard");

app.use( mw.changeHeader )
app.use( mw.validateUser );
app.use( mw.setDefaults );
app.use( bodyParser.json() );

/*
  routes are found in routes/index.js
*/
app.get('/v1.0/Authorize/:id?', routes.getAuthorization1_0 );
app.get('/v1.0/AuthReversal/:id?', routes.getAuthReversal1_0 );
app.get('/v1.0/Refund/:id?', routes.getRefund1_0 );
app.get('/v1.0/Deposit/:id?', routes.getDeposit1_0 )
app.get('/v1.0/Void/:id?', routes.getVoid1_0 );
app.get('/v1.0/All/:id?', routes.getAll1_0 );

app.post('/v1.0/Authorize', routes.postAuthorization1_0 );
app.post('/v1.0/AuthReversal', routes.postAuthReversal1_0 );
app.post('/v1.0/Refund', routes.postRefund1_0 );
app.post('/v1.0/Deposit', routes.postDeposit1_0 );
app.post('/v1.0/Void', routes.postVoid1_0 );

var server = app.listen(3000);
