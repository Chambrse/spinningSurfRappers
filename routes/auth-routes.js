var express = require('express');
var db = require("../models");
var router = express.Router();
const passport = require("passport");
//all these routes will ALWAYS start with /auth/

router.get('/login/google', passport.authenticate("google",
    {
        scope: ['profile', 'email']
    }));

router.get('/auth/google/redirect', passport.authenticate("google"), (req, res) => {

});;

router.get('/login', function (req, res) {
    res.send('help');
});
module.exports = router;