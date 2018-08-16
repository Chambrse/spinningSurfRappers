module.exports = function (sequelize, DataTypes) {
    var Handles = sequelize.define("Handles", {
        //for Tweets
        tweets: {
            type: DataTypes.CHAR,
        }
    });
    return Handles;
}