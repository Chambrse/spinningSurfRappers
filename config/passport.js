var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var GoogleStrategy = require("passport-google-oauth20");
var db = require("../models");
// var keys = require("./keys.js");
// Telling passport we want to use a Local Strategy. In other words, we want login with a username/email and password
passport.use(new LocalStrategy(
  // Our user will sign in using an email, rather than a "username"
  {
    usernameField: "email"
  },
  function (email, password, done) {
    // When a user tries to sign in this code runs
    db.User.findOne({
      where: {
        email: email
      }
    }).then(function (dbUser) {
      // If there's no user with the given email
      if (!dbUser) {
        return done(null, false, {
          message: "Incorrect email."
        });
      }
      // If there is a user with the given email, but the password the user gives us is incorrect
      else if (!dbUser.validPassword(password)) {
        return done(null, false, {
          message: "Incorrect password."
        });
      }
      // If none of the above, return the user
      return done(null, dbUser);
    });
  }
));

passport.use(new GoogleStrategy(
  {
    callbackURL: "/auth/google/redirect",
    clientID: "1063733986592-3lovnul3f88hlut58db4rvcd8a1hbcaf.apps.googleusercontent.com",
    clientSecret: "8Cqw1H323IjCwCNvyRuUdwMq"
  }, (accessToken, refreshToken, profile, done) => {
    console.log(profile);
    // db.User.create({
    //   email: profile.emails[0].value,
    //   externalID: profile.id,
    //   password: '123456'
    // })
    // })
  }));

// In order to help keep authentication state across HTTP requests,
// Sequelize needs to serialize and deserialize the user
// Just consider this part boilerplate needed to make it all work
passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
  cb(null, obj);
});

// Exporting our configured passport
module.exports = passport;
