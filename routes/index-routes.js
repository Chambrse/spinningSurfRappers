var express = require('express');
var db = require("../models");
var router = express.Router();
var path = require("path");

const keys = require('../keys.js');
var Twitter = require('twitter');
var client = new Twitter(keys.twitter);
var indico = require('indico.io');
indico.apiKey = keys.indico.api_key;

// This is data should come from api at some point
var data = [
  {
  "text": "RT @BarackObama: Aretha helped define the American experience. In her voice, we could feel our history, all of it and in every shade—our po…",
  "emotions": {
  "anger": 0.12098520994186401,
  "joy": 0.2841757535934448,
  "sadness": 0.2951808571815491,
  "fear": 0.15643292665481567,
  "surprise": 0.14322522282600403
  }
  },
  {
  "text": "Happiest birthday to my favorite Queen and constant chameleon @Madonna 🎂",
  "emotions": {
  "anger": 0.10899294912815094,
  "joy": 0.5244364142417908,
  "sadness": 0.17088940739631653,
  "fear": 0.03204158693552017,
  "surprise": 0.163639634847641
  }
  },
  {
  "text": "Udderly fab 🐄 https://t.co/ty8n6DlphA",
  "emotions": {
  "anger": 0.23326486349105835,
  "joy": 0.03894050046801567,
  "sadness": 0.4050607681274414,
  "fear": 0.3149413466453552,
  "surprise": 0.007792580872774124
  }
  },
  {
  "text": "hello send a link to cow suit pls https://t.co/HRZ1u58dTL",
  "emotions": {
  "anger": 0.39303719997406006,
  "joy": 0.019119136035442352,
  "sadness": 0.3292466402053833,
  "fear": 0.25730112195014954,
  "surprise": 0.0012959229061380029
  }
  },
  {
  "text": "You know I love a 🚲 ride to a show.   Excited to join @gustavodudamel and the @laphil for the Open Streets Festival &amp; Celebrate LA!, a free concert @hollywoodbowl on Sun, 9/30! Tix available via online sweepstakes beginning 8/20. https://t.co/zOpGkxbORl #LAPhil100 #CelebrateLA https://t.co/b0m38LuLKh",
  "emotions": {
  "anger": 0.08176252990961075,
  "joy": 0.1819392591714859,
  "sadness": 0.3952024579048157,
  "fear": 0.31620585918426514,
  "surprise": 0.024889875203371048
  }
  },
  {
  "text": "One shoe can change your life -Cinderella @kpcollections @ Sydney, Australia https://t.co/v24EcXbN3I",
  "emotions": {
  "anger": 0.17938736081123352,
  "joy": 0.08334095776081085,
  "sadness": 0.5765047073364258,
  "fear": 0.14025145769119263,
  "surprise": 0.020515497773885727
  }
  },
  {
  "text": "@lenadunham ilysm",
  "emotions": {
  "anger": 0.3641054034233093,
  "surprise": 0.19418828189373016,
  "fear": 0.18231025338172913,
  "sadness": 0.12652617692947388,
  "joy": 0.13286985456943512
  }
  },
  {
  "text": "BRISBANE! I'll be swinging by the Westfield Carindale before my show tonight! If you're nearby around 2pm come say hello to me and my 👠...and if you're not nearby, we'll be doin' this one… https://t.co/doG6eLfkBU",
  "emotions": {
  "anger": 0.18816447257995605,
  "joy": 0.0420689582824707,
  "sadness": 0.4486043155193329,
  "fear": 0.29953551292419434,
  "surprise": 0.021626682952046394
  }
  },
  {
  "text": "... and hilarious too! Never grow up @CelineDion 💘 https://t.co/sbXzzNrbRW",
  "emotions": {
  "anger": 0.2858913540840149,
  "joy": 0.029123324900865555,
  "sadness": 0.5395841598510742,
  "fear": 0.13337430357933044,
  "surprise": 0.012026875279843807
  }
  }
  ]
  
  
  
  var modifiedArray = []
  
  for (var i = 0; i < data.length; i++) {
    var highestValue = 0
    var emotion
    var tweet = "`" + data[i].text + "`"
    var anger = false
    var joy = false
    var sadness = false
    var fear = false
    var suprise = false
  
  
  
  
    if (data[i].emotions.anger > highestValue){
      highestValue = data[i].emotions.anger
      emotion = "anger"
    }
  
    if (data[i].emotions.joy > highestValue){
      highestValue = data[i].emotions.joy
      emotion = "joy"
    }
  
    if (data[i].emotions.sadness > highestValue){
      highestValue = data[i].emotions.sadness
      emotion = "sadness"
    }
  
    if (data[i].emotions.fear > highestValue){
      highestValue = data[i].emotions.fear
      emotion = "fear"
    }
  
    if (data[i].emotions.suprise > highestValue){
      highestValue = data[i].emotions.suprise
      emotion = "suprise"
    }
  
  
  
    if (emotion == "anger"){
      anger = true
    } else if (emotion == "joy") {
      joy = true
    } else if (emotion == "sadness") {
      sadness = true
    } else if (emotion == "fear") {
      fear = true
    } else if (emotion == "suprise") {
      suprise = true
    }
  
      modifiedArray.push({tweet: tweet, highestValue: highestValue, anger: anger, joy: joy, sadness: sadness, fear: fear, suprise: suprise})
  
    // console.log(highestValue);
    // console.log(emotion);
    // console.log(tweet);
  }
  
  
  console.log(modifiedArray)
    
/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {items: modifiedArray});
});

// Test the sequelize mysql connection. Should display json of the test database items.
router.get('/test', function (req, res, next) {
  db.popularTweets.findAll().then(function (data) {
    res.render("index", data);
  });
});


//Just messing around with the APIS
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
              tweetObjArray.push({
                tweet_created_at: element.created_at,
                tweet_body: element.full_text,
                poster_handle: element.user.screen_name,
                poster_profile_image: element.user.profile_image_url,
                retweets: element.retweet_count,
                favorites: element.favorite_count,
                emotions: JSON.stringify(emotions[index])
              });
            });

            res.json(tweetObjArray);

          })
          .catch(function (err) { console.log(err); });
  
  });

});

module.exports = router;
