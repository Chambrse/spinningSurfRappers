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
}