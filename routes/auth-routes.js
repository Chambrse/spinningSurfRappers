var express = require('express');
var db = require("../models");
var router = express.Router();
const passport = require("passport");
const path = require("path");

//all these routes will ALWAYS start with /auth/

router.get('/login/google', passport.authenticate("google",
    {
        scope: ['profile', 'email']
    }));

router.get('/auth/google/redirect', passport.authenticate("google"), (req, res) => {

});;

router.get('/login', function (req, res) {
    // res.render('login', {});
    res.sendFile(path.join(__dirname, "../public/login.html"));
});

router.get('/google/redirect', passport.authenticate("google"), (req,res) => {
        
});
module.exports = router;