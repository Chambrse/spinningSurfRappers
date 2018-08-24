module.exports = function (sequelize, DataTypes) {
    let UsersHandles = sequelize.define("UsersHandles", {});

    UsersHandles.associate = function (models) {
        UsersHandles.belongsTo(models.UserDetails);
        UsersHandles.belongsTo(models.Handles);
    }
    return UsersHandles;
};