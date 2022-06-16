"use strict";
module.exports = (sequelize, DataTypes) => {
  const Keywords = sequelize.define(
    "Keyword",
    {
      name: DataTypes.STRING,
    },
    {}
  );
  Keywords.associate = function (models) {
    // associations can be defined here
  };
  return Keywords;
};
