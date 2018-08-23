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

// So we can set this function to run every 12 hours
var schedule = require('node-schedule');

// Run once 
let startupCall = false;

let doIt = function () {

    db.popularTweets.drop();

    // Get popular tweets from the last week from the twitter accounts with the most followers
    client.get('search/tweets', {
        q: "from:katyperry+OR+"
            + "from:barackobama+OR+"
            + "from:rihanna+OR+"
            + "from:taylorswift13+OR+"
            + "from:ladygaga+OR+"
            + "from:theellenshow+OR+"
            + "from:jtimberlake+OR+"
            + "from:kimkardashian+OR+"
            + "from:arianagrande+OR+"
            + "from:ddlovato+OR+"
            + "from:selenagomez+OR+"
            + "from:britneyspears+OR+"
            + "from:cnnbrk+OR+"
            + "from:realdonaldtrump+OR+"
            + "from:shakira+OR+"
            + "from:jimmyfallon+OR+"
            + "from:billgates+OR+"
            + "from:jlo+OR+"
            + "from:narendramodi+OR+"
            + "from:brunomars+OR+"
            + "from:nytimes+OR+"
            /*     + "from:oprah+OR+"
                + "from:kingjames+OR"
                + "from:neymarjr+OR+"
                + "from:mileycyrus+OR+"
                + "from:niallofficial+OR+"
                + "from:drake+OR+"
                + "from:iamsrk+OR+"
                + "from:kevinhart4real+OR+"
                + "from:liltunechi+OR+"
                + "from:wizkhalifa+OR+" */
            + "from:cristiano-filter:retweets",
        result_type: "popular", tweet_mode: 'extended', count: 15
    }, function (error, tweets, response) {

        if (error) throw error;

        let analysisArray = [];
        let numberOfCalls = 0;

        console.log("number of tweets returned", tweets.statuses.length);

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

                    if (numberOfCalls === tweets.statuses.length) {
                        db.popularTweets.bulkCreate(analysisArray).then(function (data) {
                            console.log("Popular tweets have been updated!");
                        });
                    };

                };

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