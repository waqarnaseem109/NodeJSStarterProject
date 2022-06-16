"use strict";
module.exports = (sequelize, DataTypes) => {
  const TimeSheet = sequelize.define(
    "TimeSheet",
    {
      startTime: DataTypes.STRING,
      endTime: DataTypes.STRING,
      userId: DataTypes.STRING,
      validEmails: DataTypes.INTEGER,
      invalidEmails: DataTypes.INTEGER,
      hourlyData: DataTypes.JSON,
    },
    {}
  );
  TimeSheet.associate = function (models) {
    TimeSheet.belongsTo(models.User, { foreignKey: "userId", as: "User" });
  };
  return TimeSheet;
};
