"use strict";
module.exports = (sequelize, DataTypes) => {
  const Emails = sequelize.define(
    "Email",
    {
      name: DataTypes.STRING,
      emailId: DataTypes.STRING,
      userId: DataTypes.STRING,
      country: DataTypes.STRING,
    },
    {}
  );
  Emails.associate = function (models) {
    // associations can be defined here
  };
  return Emails;
};
