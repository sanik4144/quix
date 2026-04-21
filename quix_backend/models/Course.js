import { DataTypes } from 'sequelize';
import sequelize from '../db/connection.js';

const Course = sequelize.define('Course', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  thumbnail: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  difficulty: {
    type: DataTypes.ENUM('Beginner', 'Intermediate', 'Advanced'),
    defaultValue: 'Beginner',
  },
  pricing: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00,
  },
  instructorId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('DRAFT','APPROVED','REJECTED', 'PENDING'),
    defaultValue: 'DRAFT',
  },
}, {
  timestamps: true,
});

export default Course;
