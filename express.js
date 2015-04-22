var express = require('express');
var mongoskin = require('mongoskin');
var bodyParser = require('body-parser');
var logger = require('morgan');

// this line gives you access to an intance of express server object.
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// the morgan(logger) allows us to see incoming request.
app.use(logger('dev'));

// connecting to mongodb dbase using mongoskin.
//  {safe: true} argument makes sure that all updates and inserts are 
//  successful.

// var local_db = mongoskin.db('mongodb://@localhost:27017/test', {safe:true});
var db = mongoskin.db('mongodb://admin:showdown22@dogen.mongohq.com:10041/testdb', {safe: true});

app.use(function (req, res, next) {
  // create an object to store multiple collections.
  req.db = {};
  req.db.collection = db.collection('collection');
  next();
});

// let include a route with a message for user friendliness.
app.get('/', function (req, res, next) {
  res.send('please select a collection, e.g.,/collections/messages');
});

// GET ALL.
// here is how to retrieve a list of items sorted by _id
// sort(: {'_id': -1}) and that has a limit of ten (limit: 10)
app.get('/collections/:collectionName', function (req, res, next) {
  req.db.collection.find({}, {
    limit: 10, sort: {'_id': -1}
  }).toArray(function (err, results) {
    if (err) return next(err);
    res.send(results);
  });
});

// INSERT ONE
app.post('/collections/:collectionName', function (req, res, next) {
  req.db.collection.insert(req.body, {}, function (err, result) {
    if (err) return next(err);
    res.send(result);
  });
});

// GET ONE
app.get('/collections/:collectionName/:id', function (req, res, next) {
  req.db.collection.findById(req.params.id, function (err, result) {
    if (err) return next(err);
    res.send(result);
  });
});
// UDPATE ONE
// NOTE: UpdateById returns the count of the affected object.
// {safe:true, multi: false} parameter tells Mongodb to wait for execution
// before running the callback function. and to process only the first item.
app.put('/collections/:collectionName/:id', function(req, res, next) {
  req.db.collection.updateById(req.params.id, {$set: req.body}, {safe: true, multi: false},
  function (err, result) {
    if (err) return next(err);
    res.send((result === 1) ? {msg: 'success'} : {msg: 'error'});
  });
});
// DELETE ONE
app.delete('/collections/:collectionName/:id', function(req, res, next) {
  req.db.collection.removeById(req.params.id, function (err, result) {
    if (err) return next(err);
    res.send((result === 1) ? {msg: 'success'} : {msg: 'error'});
  });
});

app.listen(3000, function () {
  console.log('Express server listening on port 3000');
});




























