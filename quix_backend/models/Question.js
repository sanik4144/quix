import { DataTypes } from 'sequelize';
import sequelize from '../db/connection.js';

const Question = sequelize.define('Question', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  quizId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  questionText: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  options: {
    type: DataTypes.JSON, // Stores 4 options as a JSON array
    allowNull: false,
  },
  correctAnswer: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  timestamps: true,
});

export default Question;
