module.exports = function (sequelize, DataTypes) {
    var popularTweets = sequelize.define("popularTweets", {
        tweet_created_at: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        tweet_body: {
            type: DataTypes.STRING(1080),
            allowNull: false,
        },
        poster_handle: {
            type: DataTypes.STRING,
            allownull: false
        },
        retweets: {
            type: DataTypes.INTEGER,
            allownull: false
        },
        favorites: {
            type: DataTypes.INTEGER,
            allownull: false
        }
    });

    return popularTweets;
};