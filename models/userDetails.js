module.exports = function (sequelize, DataTypes) {
  var UserDetails = sequelize.define("UserDetails", {
    // Giving the userdetails a name of type string
    User_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 100]
      }
    },
    //for password
    Password: {
      type: DataTypes.CHAR,
      allowNull: false,
      validate: {
        len: [1, 100]
      }
    },
    //email
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 150]
      }
    }
  });
  UserDetails.associate = function (models) {
    UserDetails.hasMany(models.UsersHandles, {
      onDelete: "CASCADE"
    });
    UserDetails.hasMany(models.UsersFavoritedTweets, {
      onDelete: "CASCADE"
    });
  }
  return UserDetails;
};