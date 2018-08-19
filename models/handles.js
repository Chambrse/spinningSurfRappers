var users = require('../models/userDetails.js');
module.exports = function (sequelize, DataTypes) {
    var Handles = sequelize.define("Handles", {
        //for Tweets
        tweets: {
            type: DataTypes.STRING,
        }
    });
    Handles.associate = function(models){
        Handles.belongsToMany(models.UserDetails, {
            through: users 
        });
    }
    return Handles;
};