var db = require("../models");

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
        ret.subs.push(userHandle.Handle);
      })
      res.json(ret);

    });
  });
  // API call to handle user's subscribing to certain handles
  // User ID is sent by front end via req.body.id
  // and handle is sent via api post call
  app.post("/user/:handle", function (req, res) {
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
        });
        // Since the handle didn't exist before now, we don't need to check if the 
        // link is in UsersHandles
        toggleUserSubscription(false, userId, handleName, res);
      }
      else {
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
      res.json('USER SUBSRIBED TO ' + handleName);
    }
    else {
      db.UsersHandles.destroy({
        where: {
          UserDetailId: userId,
          HandleHandleName: handleName
        }
      });
      res.json('USER UNSUBSRIBED TO ' + handleName);
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

  app.post('/api/bitch', function (req, res) {

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
          toggleUserFavorite(true, userId, dbTweet.id, res);
        });
      }
    });

    // help function

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
          UserDetailId: userId,
          FavoritedTweetId: tweetId
        }).then(function () {
          res.json("USER UN-LIKED " + tweetId);
        });
      }
    }
  });
}