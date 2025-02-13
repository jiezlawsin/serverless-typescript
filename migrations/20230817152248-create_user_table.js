'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable(
      'User',
      {
        sub: {
          type: Sequelize.DataTypes.UUID,
          defaultValue: Sequelize.DataTypes.UUIDV4,
          primaryKey: true,
        },
        name: {
          type: Sequelize.DataTypes.STRING(150),
          allowNull: false,
        },
        userName: {
          type: Sequelize.DataTypes.STRING(12),
          allowNull: false,
        },
        email: {
          type: Sequelize.DataTypes.STRING(100),
          allowNull: false,
          validate: {
            isEmail: true,
          },
        },
        status: {
          type: Sequelize.DataTypes.STRING(100),
          allowNull: false,
        },
        loginAttemptsCounter: {
          type: Sequelize.DataTypes.INTEGER,
          allowNull: true,
        },
        otpAttemptsCounter: {
          type: Sequelize.DataTypes.INTEGER,
          allowNull: true,
        },
        otpToken: {
          type: Sequelize.DataTypes.TEXT,
          allowNull: true,
        },
        refreshToken: {
          type: Sequelize.DataTypes.TEXT,
          allowNull: true,
        },
        forgotPasswordToken: {
          type: Sequelize.DataTypes.TEXT,
          allowNull: true,
        },
        confirmationtoken: {
          type: Sequelize.DataTypes.TEXT,
          allowNull: true,
        },
        updatedAt: Sequelize.DataTypes.DATE,
        createdAt: Sequelize.DataTypes.DATE,
      },
      {
        hooks: {
          beforeCreate: function (person, options, fn) {
            person.createdAt = new Date();
            person.updatedAt = new Date();
            fn(null, person);
          },
          beforeUpdate: function (person, options, fn) {
            person.updatedAt = new Date();
            fn(null, person);
          },
        },
      }
    );
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.dropTable('User');
  },
};
