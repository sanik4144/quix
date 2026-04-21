import { DataTypes } from 'sequelize';
import sequelize from '../db/connection.js';

const LessonCompletion = sequelize.define('LessonCompletion', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  enrollmentId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  lessonId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
}, {
  timestamps: true,
});

export default LessonCompletion;
