module.exports = function (sequelize, DataTypes) {
    var Handles = sequelize.define("Handles", {
        //for Tweets
        tweets: {
            type: DataTypes.STRING,
        }
    });
    Handles.associate = function (models) {
        Handles.belongsTo(models.UserDetails, {
            foreignKey: {
                allowNull: false
            }
        });
    }
    return Handles;
};