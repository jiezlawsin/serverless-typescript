import { Model, DataTypes, Sequelize } from "sequelize";
import { Status } from "../interfaces/statusType"

export interface IUser {
  sub: string;
  name: string;
  userName: string;
  email: string;
  status: Status;
  loginAttemptsCounter?: number;
  otpAttemptsCounter?: number;
  otpToken?: string;
  refreshToken?: string;
  forgotPasswordtoken?: string;
  confirmationtoken?: string;
}
export interface User extends IUser, Model {
  updatedAt?: Date;
  createdAt?: Date;
}

export async function initUser(sequelize: Sequelize) {
  sequelize.define('User',
    {
      sub: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(150),
        allowNull: false,
      },
      userName: {
        type: DataTypes.STRING(12),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
          isEmail: true,
        },
      },
      status: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      loginAttemptsCounter: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      otpAttemptsCounter: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      otpToken: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      refreshToken: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      forgotPasswordToken: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      confirmationtoken: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    }, {
    tableName: 'User',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "User_pkey",
        unique: true,
        fields: [
          { name: "sub" },
        ]
      },
    ],
    hooks: {
      beforeCreate: async function (person: User) {
        person.createdAt = new Date();
        person.updatedAt = new Date();
      },
      beforeUpdate: async function (person: User) {
        person.updatedAt = new Date();
      },
    },
  });
}
