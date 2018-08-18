var express = require('express');
var db = require("../models");
var router = express.Router();
var path = require("path");


require("dotenv").config();

const keys = require('../keys.js');
var Twitter = require('twitter');
var client = new Twitter(keys.twitter);
var request = require('request');
var indico = require('indico.io');
indico.apiKey = keys.indico.api_key;

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {title:Express});
});

// Test the sequelize mysql connection. Should display json of the test database items.
router.get('/test', function (req, res, next) {
  db.Tweet_emotion_tracker.findAll().then(function (data) {
    console.log(data);
    res.json(data);
  });
});
router.get('/sentimentTest/:handle', function (req, res, next) {
/*   var params = { screen_name: req.params.handle, tweet_mode: 'extended', count: 10 };
  client.get('statuses/user_timeline', params, function (error, tweets, response) {
  
      if (error) {
          console.log("twitterError", error);
          return;
      };

      // res.json(tweets);

      let tweetsTextArray = [];

      tweets.forEach(element => {
        tweetsTextArray.push(element.full_text);
      });


      indico.emotion(tweetsTextArray)
          .then(function (emotions) {
            let tweetsObj = []

            emotions.forEach(function (element, index) {
              tweetsObj.push({ text: tweetsTextArray[index], emotions: element});
            });

            res.json(tweetsObj);
          })
          .catch(function (err) { console.log(err); });
  
  }); */
/* 
  client.get('search/tweets', {q: '', result_type: "popular"}, function(error, tweets, response) {
    res.json(tweets);
  }); */
});

module.exports = router;
