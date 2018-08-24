const keys = require('../keys.js');

// IBM
var ToneAnalyzerV3 = require('watson-developer-cloud/tone-analyzer/v3');

var toneAnalyzer = new ToneAnalyzerV3({
    "url": "https://gateway.watsonplatform.net/tone-analyzer/api",
    "username": keys.IBM.IBMUsername,
    "password": keys.IBM.IBMPassword,
    "version_date": "2017-09-21"
});

// Twitter API
var Twitter = require('twitter');
var client = new Twitter(keys.twitter);

// Database
let db = require("../models");

let startupCall;
// So we can set this function to run every 12 hours
var schedule = require('node-schedule');
if (process.env.GET_TWEETS_ON_START && process.env.GET_TWEETS_ON_START === true) {
    startupCall = true;
} else {
    startupCall = false;
}

let doIt = function () {

    db.popularTweets.drop();

    let handleArray = ["katyperry", "barackobama", "rihanna", "justinbeiber", "taylorswift13", "ladygaga", "theellenshow", "cristiano", "jtimberlake", "kinkardashian", "ddlovato", "selenagomez", "britneyspears", "realdonaldtrump", "shakira", "jimmyfallon", "billgates", "jlo", "brunomars", "oprah", "kingjames", "mileycyrus", "drake", "kevinhart4real", "wizkhalifa", "chrisbrown", "emmawatson", "conanobrien", "adele", "zaynmalik", "danieltosh", "potus"];

    let analysisArray = [];
    let numberOfCalls = 0;
    let callsExpected = 0;
    handleArray.forEach(function (element, index) {

        // Get popular tweets from the last week from the twitter accounts with the most followers
        client.get('search/tweets', {
            q: "from:" + element /* + "-filter:retweets" */, result_type: "mixed", tweet_mode: 'extended', count: 2
        }, function (error, tweets, response) {

            // console.log(error);

            if (error) throw error;

            callsExpected += tweets.statuses.length;

            tweets.statuses.forEach(element => {

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
                            emotions: JSON.stringify(toneAnalysis)
                        });

                        if (numberOfCalls === callsExpected) {
                            db.popularTweets.bulkCreate(analysisArray).then(function (data) {
                                console.log("Popular tweets have been updated!");
                            });
                        };

                    };

                });

            });

        });

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