var express = require('express');
var db = require("../models");
var router = express.Router();
var path = require("path");
var isAuthenticated = require("../config/middleware/isAuthenticated");
const keys = require('../keys.js');

//twitter
var Twitter = require('twitter');
var client = new Twitter(keys.twitter);

//indico
var indico = require('indico.io');
indico.apiKey = keys.indico.api_key;

// IBM
var ToneAnalyzerV3 = require('watson-developer-cloud/tone-analyzer/v3');

var toneAnalyzer = new ToneAnalyzerV3({
  "url": "https://gateway.watsonplatform.net/tone-analyzer/api",
  "username": keys.IBM.IBMUsername,
  "password": keys.IBM.IBMPassword,
  "version_date": "2017-09-21"
});

/* GET user page */
router.get('/user', isAuthenticated,function (req, res, next) {
  res.render('user');
});

//get about page
router.get('/about', function (req, res, next) {
  res.render('about');
});


router.get('/', function (req, res, next) {
  db.popularTweets.findAll({order: [['tweet_created_at', 'DESC']]}).then(function (data) {

    data.forEach(element => {
      element.emotions = JSON.parse(element.emotions);
    });

    // res.json(data);

    res.render("index", { items: data });
  });
});

// sign up request 

router.post('/signup', function (req, res, next) {
  //process the form data// 
  console.log(req.body)
  // create an user on the database
  const user = db.UserDetails.build({
    User_name: req.body.username,
    Password: req.body.password,
    email: req.body.email,
  })

  user
    .save()
    .then(savedUser => {
      console.log("then", savedUser)
      //userpage
      res.redirect('/user')
    })
    .catch(error => {
      console.log("catch", error)
      //not sure what to do if they get an error
    })

});


/* // Indico sentiment analysis by twitter handle.
router.get('/sentiment/:handle', function (req, res, next) {
  var params = { screen_name: req.params.handle, tweet_mode: 'extended', count: 10 };
  client.get('statuses/user_timeline', params, function (error, tweets, response) {

    if (error) throw error;

    let tweetsTextArray = [];

    tweets.forEach(element => {
      tweetsTextArray.push(element.full_text);
    });
    indico.emotion(tweetsTextArray)
      .then(function (emotions) {

        // Grab the important stuff
        let tweetObjArray = [];
        tweets.forEach(function (element, index) {

          let dominantEmotion;
          let currentEmotions = emotions[index];
          let highestNumber = 0;
          for (key in currentEmotions) {
            if (currentEmotions[key] > highestNumber) {
              highestNumber = currentEmotions[key];
              dominantEmotion = key;
            }
          };

          tweetObjArray.push({
            tweet_created_at: element.created_at,
            tweet_body: element.full_text,
            poster_handle: element.user.screen_name,
            poster_profile_image: element.user.profile_image_url,
            retweets: element.retweet_count,
            favorites: element.favorite_count,
            emotions: JSON.stringify(emotions[index]),
            dominant_emotion: dominantEmotion
          });
        });

        res.json(tweetObjArray);

      })
      .catch(function (err) { console.log(err); });

  });

});
 */

// ibm watson tone analyzer by handle
router.get('/ibm/:handle', function (req, res, next) {

  var params = { screen_name: req.params.handle, tweet_mode: 'extended', count: 10 };
  client.get('statuses/user_timeline', params, function (error, tweets, response) {

    let analysisArray = [];
    let numberOfCalls = 0;

    tweets.forEach(element => {

      let text = element.full_text;

      var toneParams = {
        'tone_input': { 'text': text },
        'content_type': 'application/json'
      };

      toneAnalyzer.tone(toneParams, function (error, toneAnalysis) {

        if (error) {
          console.log(error);
        } else {
          numberOfCalls++;

          analysisArray.push({
            tweet_created_at: element.created_at,
            tweet_body: element.full_text,
            poster_name: element.user.name,
            poster_handle: element.user.screen_name,
            poster_profile_image: element.user.profile_image_url,
            retweets: element.retweet_count,
            favorites: element.favorite_count,
            emotions: toneAnalysis
          });

          if (numberOfCalls === tweets.length) {
            res.render("index", analysisArray);
          };

        };

      });

    });

  });

});

module.exports = router;