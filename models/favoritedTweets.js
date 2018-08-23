module.exports = function (sequelize, DataTypes) {
    const FavoritedTweets = sequelize.define("FavoritedTweets", {
        // Since we can't get some kind of unqiue identifier easily 
        // Like handles from twitter users
        // We have to make a make-shift one
        // Each tweet will have a primary key 
        // that is the handle name + the date that the tweet was created
        // e.g. "2018-08-21 16:05:37 ArianaGrande"
        // This should work 99% of the time because tweets aren't ideally created in the same second
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
            unqiue: true
        },
        tweet: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });

    FavoritedTweets.associate = function (models) {
        FavoritedTweets.hasMany(models.UsersFavoritedTweets);
    }

    
    return FavoritedTweets;
}