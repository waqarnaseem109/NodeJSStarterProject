"use strict";
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      username: DataTypes.STRING,
      contactNo: DataTypes.STRING,
      type: DataTypes.STRING,
      contactNo: DataTypes.STRING,
      dob: DataTypes.STRING,
    },
    {}
  );
  User.associate = function (models) {
    // associations can be defined here
    User.hasMany(models.TimeSheet, { foreignKey: "userId", as: "timesheet" });
  };
  return User;
};
