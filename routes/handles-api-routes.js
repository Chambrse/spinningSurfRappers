var db = require("../models");
const passport = require('passport');
module.exports = function (app) {
    //GET route for all the posts
    app.get("/api/handles", function (req, res) {
        var query = {};
        if (req.query.author_id) {
            query.HandlesId = req.query.handles_id;
        }
        db.UserDetails.findAll({
            where: query,
            include: [db.Handles]
        }).then(function (dbHandles) {
            res.json(dbHandles);
        });
    });

    // This get call will retrieve a handles subscriptions, name and total number
    app.get("/api/handles/:handleName", function (req, res) {
        const handleName = req.params.handleName;
        db.Handles.findOne({
            where: {
                handleName: handleName,
            },
            include: [{
                model: db.UsersHandles,
                include: db.UserDetails
            }]
        }).then(function (dbHandle) {
            res.json(dbHandle);
        });
    });

    // POST route to add a new handle if it doesn't exist
    app.post("/api/handles", function (req, res) {
        const newHandleName = req.body.handleName;
        db.findOne({
            where: {
                handleName: newHandleName
            }
        }).then(function (dbHandle) {
            if (!dbHandle) {
                db.Handles.create({
                    handleName: newHandleName
                }).then(function (dbHandle) {
                    res.json("New handle, " + dbHandle.handleName + " created. ");
                });
            }
            else {
                res.json(dbHandle.handleName + " already exists. ");
            }
        });
    });

    //PUT route to update tweets
    app.put("/api/handles", function (req, res) {
        db.Handles.update(
            req.body,
            {
                where: {
                    id: req.body.id
                }
            }).then(function (dbHandles) {
                res.json(dbHandles);
            });
    });
    // Using the passport.authenticate middleware with our local strategy.
    // If the user has valid login credentials, send them to the members page.
    // Otherwise the user will be sent an error
    app.post("/api/login", passport.authenticate("local"), function (req, res) {
        // Since we're doing a POST with javascript, we can't actually redirect that post into a GET request
        // So we're sending the user back the route to the members page because the redirect will happen on the front end
        // They won't get this or even be able to access this page if they aren't authed
        res.json("/user");
    });

    // Route for signing up a user. The user's password is automatically hashed and stored securely thanks to
    // how we configured our Sequelize User Model. If the user is created successfully, proceed to log the user in,
    // otherwise send back an error
    app.post("/api/signup", function (req, res) {
        console.log(req.body);
        db.UserDetails.create({
            User_name: req.body.username,
            email: req.body.email,
            Password: req.body.password
        })
            .then(function () {
                res.redirect(307, "/api/login");
            }).catch(function (err) {
                console.log(err);
                res.json(err);
                // res.status(422).json(err.errors[0].message);
            });
    });

    // Route for logging user out
    app.get("/logout", function (req, res) {
        req.logout();
        res.redirect("/");
    });

    // Route for getting some data about our user to be used client side
    app.get("/api/user_data", function (req, res) {
        if (!req.user) {
            // The user is not logged in, send back an empty object
            res.json({});
        }
        else {
            // Otherwise send back the user's email and id
            // Sending back a password, even a hashed password, isn't a good idea
            console.log(req.user);
            // Everything that is stored in the user in the database can be sent back to the front-end
            res.json({
                username: req.user.User_name,
                email: req.user.email,
                id: req.user.id
            });
        }
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

    // this call will retrieve all the current subscriptions the current user has
    app.get("/api/user_subs/:userId", function (req, res) {
        const userId = req.params.userId;
        // const userId = 1;
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
                ret.subs.push(userHandle.Handle.handleName);
            })
            res.json(ret);

        });
    });



};