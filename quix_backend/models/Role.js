import { DataTypes } from 'sequelize';
import sequelize from '../db/connection.js';

const Role = sequelize.define('Role', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  permissions: {
    type: DataTypes.JSON,
    allowNull: true,
  },
}, {
  timestamps: true,
});

export default Role;
