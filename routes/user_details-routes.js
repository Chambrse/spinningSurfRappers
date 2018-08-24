var db = require("../models");

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

module.exports = function (app) {
  // this call will retrieve all the current subscriptions the current user has
  app.get("/api/user_subs/:userId", function (req, res) {
    const userId = req.params.userId;

    db.UserDetails.findOne({
      include: [{
        model: db.UsersHandles,
        include: [{
          model: db.Handles
        }]
<<<<<<< HEAD
=======
      },
      {
        model: db.UsersFavoritedTweets,
        include: db.FavoritedTweets
>>>>>>> e42865b3f85f06221fcab6654d35b86a3ec1349f
      }],
      where: {
        id: userId
      }
    }).then(function (dbUser) {
      let ret = {
        userName: dbUser.User_name,
        subs: []
      };

      dbUser.UsersHandles.forEach(userHandle => {
        ret.subs.push(userHandle.Handle.handleName);
      })
<<<<<<< HEAD
      res.json(ret);
=======
      // res.json(ret);
      res.json(dbUser);
>>>>>>> e42865b3f85f06221fcab6654d35b86a3ec1349f

    });
  });
  // API call to handle user's subscribing to certain handles
  // User ID is sent by front end via req.body.id
  // and handle is sent via api post call
  app.post("/api/user/subscribeto/:handle", function (req, res) {
    const handleName = req.params.handle;
    const userId = req.body.id;

    // First, we need to see if the twitter handle is in our database or not.

    db.Handles.findOne({
      where: {
        handleName: handleName
      }
    }).then(function (dbHandle) {
      if (!dbHandle) {
        // If there is no handle in our database, then create one.
        db.Handles.create({
          handleName: handleName
        }).then((dbUser) => {
          // Since the handle didn't exist before now, we don't need to check if the 
          // link is in UsersHandles
          toggleUserSubscription(false, userId, handleName, res);
        });
      }
      else {
        console.log(userId);
        db.UsersHandles.findOne({
          where: {
            UserDetailId: userId,
            HandleHandleName: handleName
          }
        }).then((dbUser) => {
          toggleUserSubscription(dbUser, userId, handleName, res);
        });
      }
    });
  });
  // POST user/:handle Helper Functions

  function toggleUserSubscription(dbUser, userId, handleName, res) {
    if (!dbUser) {
      db.UsersHandles.create({
        UserDetailId: userId,
        HandleHandleName: handleName
      });
      // res.json('USER SUBSRIBED TO ' + handleName);
      res.json(true);
    }
    else {
      db.UsersHandles.destroy({
        where: {
          UserDetailId: userId,
          HandleHandleName: handleName
        }
      });
      // res.json('USER UNSUBSRIBED TO ' + handleName);
      res.json(false);
    }
  }

  // a GET route for retrieving a users favorited tweets

  app.get('/api/user_favorites/:userId', function (req, res) {
    const userId = req.params.userId;

    db.UserDetails.findOne({
      include: [{
        model: db.UsersFavoritedTweets,
        include: [{
          model: db.FavoritedTweets
        }]
      }],
      where: {
        id: userId
      }
    }).then(function (dbUser) {
      res.json(dbUser);
    });
  });

  app.post('/api/user/favorite', function (req, res) {

    const tweetId = req.body.tweetId;
    const tweetContent = req.body.tweet;
    const userId = req.body.id;

    console.log(tweetId, tweetContent, userId);

    db.FavoritedTweets.findOne({
      where: {
        id: tweetId
      }
    }).then(function (dbTweet) {
      if (!dbTweet) {
        db.FavoritedTweets.create({
          tweet: tweetContent,
          id: tweetId
        }).then(function (dbTweet) {
          toggleUserFavorite(false, userId, dbTweet.id, res);
        });
      }
      else {
        db.UsersFavoritedTweets.findOne({
          where: {
            UserDetailId: userId,
            FavoritedTweetId: tweetId
          }
        }).then(function (dbUserTweet) {
          toggleUserFavorite(dbUserTweet, userId, dbTweet.id, res);
        });
      }
    });

    // helper function

    function toggleUserFavorite(linkExistance, userId, tweetId, res) {
      if (!linkExistance) {
        db.UsersFavoritedTweets.create({
          UserDetailId: userId,
          FavoritedTweetId: tweetId
        }).then(function () {
          res.json("USER LIKED " + tweetId);
        });
      }
      else {
        db.UsersFavoritedTweets.destroy({
          where: {
            UserDetailId: userId,
            FavoritedTweetId: tweetId
          }
        }).then(function () {
          res.json("USER UN-LIKED " + tweetId);
        });
      }
    }
  });
}