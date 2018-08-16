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
  }
  );
  return UserDetails;
};