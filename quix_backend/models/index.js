import Role from './Role.js';
import User from './User.js';
import Course from './Course.js';
import Lesson from './Lesson.js';
import Quiz from './Quiz.js';
import Question from './Question.js';
import Enrollment from './Enrollment.js';
import LessonCompletion from './LessonCompletion.js';
import QuizAttempt from './QuizAttempt.js';

// User - Role
Role.hasMany(User, { foreignKey: 'roleId' });
User.belongsTo(Role, { foreignKey: 'roleId' });

// User (Instructor) - Course
User.hasMany(Course, { foreignKey: 'instructorId' });
Course.belongsTo(User, { as: 'instructor', foreignKey: 'instructorId' });

// Course - Lesson
Course.hasMany(Lesson, { foreignKey: 'courseId' });
Lesson.belongsTo(Course, { foreignKey: 'courseId' });

// Course - Quiz
Course.hasOne(Quiz, { foreignKey: 'courseId' });
Quiz.belongsTo(Course, { foreignKey: 'courseId' });

// Quiz - Question
Quiz.hasMany(Question, { foreignKey: 'quizId' });
Question.belongsTo(Quiz, { foreignKey: 'quizId' });

// Student - Enrollment
User.hasMany(Enrollment, { foreignKey: 'studentId' });
Enrollment.belongsTo(User, { as: 'student', foreignKey: 'studentId' });

// Course - Enrollment
Course.hasMany(Enrollment, { foreignKey: 'courseId' });
Enrollment.belongsTo(Course, { foreignKey: 'courseId' });

// Enrollment - LessonCompletion
Enrollment.hasMany(LessonCompletion, { foreignKey: 'enrollmentId' });
LessonCompletion.belongsTo(Enrollment, { foreignKey: 'enrollmentId' });

// Lesson - LessonCompletion
Lesson.hasMany(LessonCompletion, { foreignKey: 'lessonId' });
LessonCompletion.belongsTo(Lesson, { foreignKey: 'lessonId' });

// Student - QuizAttempt
User.hasMany(QuizAttempt, { foreignKey: 'studentId' });
QuizAttempt.belongsTo(User, { as: 'student', foreignKey: 'studentId' });

// Quiz - QuizAttempt
Quiz.hasMany(QuizAttempt, { foreignKey: 'quizId' });
QuizAttempt.belongsTo(Quiz, { foreignKey: 'quizId' });

export {
  Role,
  User,
  Course,
  Lesson,
  Quiz,
  Question,
  Enrollment,
  LessonCompletion,
  QuizAttempt,
};
