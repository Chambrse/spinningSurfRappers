module.exports = function (sequelize, DataTypes) {
    var Handles = sequelize.define("Handles", {
        handleName: {
            type: DataTypes.STRING,
            primaryKey: true,
            unique: true
        }
    });
    
    Handles.associate = function(models){
        Handles.hasMany(models.UsersHandles);
    }

    return Handles;
}