

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
/* Don't use this file anymore unless we go back to indico. use getpopularIBM.js instead
(it is pretty much the same) */






// Twitter API
const keys = require('../keys.js');
var Twitter = require('twitter');
var client = new Twitter(keys.twitter);

//Indico API
var indico = require('indico.io');
indico.apiKey = keys.indico.api_key;

// Database
let db = require("../models");

// So we can set this function to run every 12 hours
var schedule = require('node-schedule');

// Run once 
let startupCall = false;

let doIt = function () {

  // Get popular tweets from the last week from the twitter accounts with the most followers
  client.get('search/tweets', {
    q: "from:katyperry+OR+from:barackobama+OR+from:rihanna+OR+from:taylorswift13+OR+from:ladygaga+OR+from:theellenshow+OR+from:cristiano-filter:retweets"
    , result_type: "popular", tweet_mode: 'extended', count: 50
  }, function (error, tweets, response) {

    if (error) throw error;

    let tweetsTextArray = [];

    tweets.statuses.forEach(element => {
      tweetsTextArray.push(element.full_text);
    });

    indico.emotion(tweetsTextArray)
      .then(function (emotions) {

        // Grab the important stuff
        let tweetObjArray = [];
        tweets.statuses.forEach(function (element, index) {
          
          let dominantEmotion;
          let currentEmotions = emotions[index];
          let highestNumber = 0;
          for (key in currentEmotions) {
            if (currentEmotions[key] > highestNumber) {
              highestNumber = currentEmotions[key];
              dominantEmotion = key;
            }
          }

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

        // Smack 'em into the database
        db.popularTweets.bulkCreate(tweetObjArray).then(function (data) {
          console.log("Popular tweets have been updated!");
        });

      })
      .catch(function (err) { console.log(err); });

  });
};

module.exports = function getPopular() {

  if (startupCall) {

    doIt();
    startupCall = false;

  } else {

    var j = schedule.scheduleJob('0 0 0,12 * *', function () {
      doIt();
    });

  };
};