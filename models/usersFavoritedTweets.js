module.exports = function (sequelize, DataTypes) {
    let UsersFavoritedTweets = sequelize.define("UsersFavoritedTweets", {});

    UsersFavoritedTweets.associate = function (models) {
        UsersFavoritedTweets.belongsTo(models.UserDetails);
        // I have absolutely no clue why this model will work without the belongsTo below.
        UsersFavoritedTweets.belongsTo(models.FavoritedTweets);
    }
    return UsersFavoritedTweets;
};