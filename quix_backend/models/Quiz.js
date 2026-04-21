import { DataTypes } from 'sequelize';
import sequelize from '../db/connection.js';

const Quiz = sequelize.define('Quiz', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  courseId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  timeLimit: {
    type: DataTypes.INTEGER, // in minutes
    defaultValue: 30,
  },
  passPercentage: {
    type: DataTypes.INTEGER,
    defaultValue: 50,
  },
}, {
  timestamps: true,
});

export default Quiz;
