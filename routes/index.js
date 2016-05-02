var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');
var assert = require('assert');

var shortid = require('shortid');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

// router.get('/newurl', function(req,res){
//   res.render('newurl', {title: 'Add URL'});
// });

// router.post('/newurl', function(req,res){
//   var MongoClient = mongodb.MongoClient

//   var url = 'mongodb://localhost:27017/url2'

//   MongoClient.connect(url, function(err, db){
//     if (err){
//       console.log("Unable to connect to server", err);
//     } else {
//       console.log("Connected to server")

//       var collection = db.collection('urls');

//       var findUrl = {short: req.body.url};
//       var print = collection.find({"short": findUrl});
//       console.log(print);

//       var newUrl = {url: req.body.url, short: shortid.generate()};
//       collection.insert([newUrl], function(err, result){
//         if (err) {
//           console.log(err);
//         } else {
//           res.render('index');
//         }
//         db.close();
//       });
//     }
//   });
// });

router.get('/:entry', function(req, res, next) {
  var MongoClient = mongodb.MongoClient

  var url = 'mongodb://localhost:27017/url2'

  MongoClient.connect(url, function(err, db){
    if (err){
      console.log("Unable to connect to server", err);
    } else {
      console.log("Connected to server")
      
    var collection = db.collection('urls');
    var entry = req.params.entry;
    
    var local = "localhost:3000/";
    
    var findLink = function(db, callback) {
    collection.findOne( { "short": entry }, {url: 1, _id: 0}, function(err, doc) {
    if (doc != null) {
      console.log('URL Found!');
      res.redirect(doc.url);
        } else {
          console.log('URL NOT FOUND! NEW ENTRY!');
          var short = shortid.generate();
          var newUrl = {url: entry, short: short};
          collection.insert([newUrl]);
          res.json({original_url: entry, short_url: local+short});
        };
      });
    };
    
    findLink(db, function() {
      db.close();
    });
    
    
    
    };
  });
});

module.exports = router;
