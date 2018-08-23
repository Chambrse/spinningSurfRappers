// var express = require('express');
// var router = express.Router();
// Shouldn't need these if we do this apropiately

var db = require("../models");
const passport = require("passport");
const path = require("path");
// Need these however

module.exports = function (app) {
    app.get('/auth/login/google', passport.authenticate("google",
        {
            scope: ['profile', 'email']
        }
    ));

    app.get('/auth/google/redirect', passport.authenticate("google"), (req, res) => {
        res.redirect('/');
    });
}
