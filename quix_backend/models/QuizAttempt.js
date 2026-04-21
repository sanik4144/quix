import { DataTypes } from 'sequelize';
import sequelize from '../db/connection.js';

const QuizAttempt = sequelize.define('QuizAttempt', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  studentId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  quizId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  score: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('PASS', 'FAIL'),
    allowNull: false,
  },
}, {
  timestamps: true,
});

export default QuizAttempt;
