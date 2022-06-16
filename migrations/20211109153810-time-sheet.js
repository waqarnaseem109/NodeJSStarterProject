"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("TimeSheets", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      startTime: {
        type: Sequelize.STRING,
      },
      endTime: {
        type: Sequelize.STRING,
      },
      userId: {
        type: Sequelize.STRING,
      },
      validEmails: {
        type: Sequelize.INTEGER,
      },
      invalidEmails: {
        type: Sequelize.INTEGER,
      },
      hourlyData: {
        type: Sequelize.JSON,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
    return queryInterface.dropTable("TimeSheets");
  },
};
