import { DataTypes } from 'sequelize';
import sequelize from '../db/connection.js';

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  fullName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  roleId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: "Roles",
      key: "id",
    },
  },
  status: {
    type: DataTypes.ENUM('PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED'),
    defaultValue: 'PENDING',
  },
  remarks: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  timestamps: true,
});

export default User;
