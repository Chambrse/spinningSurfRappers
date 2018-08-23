var users = require('../models/userDetails.js');
module.exports = function (sequelize, DataTypes) {
    var Handles = sequelize.define("Handles", {
        //for Tweets
        // tweets: {
        //     type: DataTypes.STRING,
        // },

        handleName: {
            type: DataTypes.STRING,
            primaryKey: true,
            unique: true
        }
    });
    Handles.associate = function (models) {
        Handles.belongsTo(models.UserDetails, {
            foreignKey: {
                allowNull: false
            }
        });
    
    Handles.associate = function(models){
        Handles.hasMany(models.UsersHandles);
    }
} 
    return Handles;
}