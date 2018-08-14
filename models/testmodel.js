module.exports = function(sequelize, DataTypes) {
    var testTable = sequelize.define("testTable", {
      test_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [1]
        }
      },
      test_boolean: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      }},
      {
        timestamps: false
      }
    );
  
    return testTable;
  };