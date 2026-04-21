import { DataTypes } from 'sequelize';
import sequelize from '../db/connection.js';

const Enrollment = sequelize.define('Enrollment', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  studentId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  courseId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  progress: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
}, {
  timestamps: true,
});

export default Enrollment;
