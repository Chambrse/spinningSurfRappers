module.exports = function (sequelize, DataTypes) {
    let UsersFavoritedTweets = sequelize.define("UsersFavoritedTweets", {});

    UsersFavoritedTweets.associate = function (models) {
        UsersFavoritedTweets.belongsTo(models.UserDetails);
        UsersFavoritedTweets.belongsTo(models.FavoritedTweets);
    }
    return UsersFavoritedTweets;
};