const passport = require("passport");
module.exports = function(app) {
    app.get('/auth/login', passport.authenticate("google", 
    {
        scope: ['profile', 'email']
    }));

    app.get('/auth/google/redirect', passport.authenticate("google"), (req,res) => {
        
    });
};