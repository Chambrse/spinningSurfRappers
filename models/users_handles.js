module.exports = function (sequelize, DataTypes) {
    const UsersHandles = sequelize.define("UsersHandles", {});

    UsersHandles.associate = function (models) {
        UsersHandles.belongsTo(models.UserDetails);
        UsersHandles.belongsTo(models.Handles);
    }
    return UsersHandles;
};