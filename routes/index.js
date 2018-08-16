var express = require('express');
var db = require("../models");
var router = express.Router();

require("dotenv").config();

const keys = require('../keys.js');
var Twitter = require('twitter');
var client = new Twitter(keys.twitter);
var request = require('request');
var indico = require('indico.io');
indico.apiKey = keys.indico.api_key;

var text;
var line = "-------------------------";

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('underConstruction');
});


// Test the sequelize mysql connection. Should display json of the test database items.
router.get('/test', function (req, res, next) {
  db.testTable.findAll().then(function (data) {
    console.log(data);
    res.json(data);
  });
});

router.get('/sentimentTest', function (req, res, next) {
  var params = { screen_name: 'realDonaldTrump', tweet_mode: 'extended', count: 10 };
  client.get('statuses/user_timeline', params, function (error, tweets, response) {
  
      if (error) {
          console.log("twitterError", error);
          return;
      };
  
      console.log("Donald Trumps most recent tweet:\n" )
      console.log(tweets[0].full_text);
  
      text = tweets[0].full_text;
  
  
      var response = function (emotions) {

        res.json({emotions: emotions, tweet: text});

/*           console.log(line);
          for (var key in res) {
              console.log(key + ": " + Math.floor(res[key] * 100) + "%");
          }; */
      };
      var logError = function (err) { console.log(err); }
  
      indico.emotion(text)
          .then(response)
          .catch(logError);
  
  });
});

module.exports = router;
