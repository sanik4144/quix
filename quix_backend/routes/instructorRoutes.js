import express from 'express';
import { 
    createCourse,
    deleteCourse,
    updateCourse, 
    getInstructorCourses, 
    submitCourseForReview,
    addLesson,
    createQuiz,
    addQuestionToQuiz,
    getEnrolledStudents,
    viewLesson,
    updateLesson,
    deleteLesson,
    getDashboardStats,
    getQuizDetail,
    deleteQuestion,
    getQuizAttemptsForInstructor,
    getCourseDetail,
    getStudentQuizAttemptsForInstructor
} from '../controllers/instructorController.js';

import { authenticate, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticate);
router.use(authorize(['instructor']));

// Dashboard Stats
router.get('/stats', getDashboardStats);

// Course Management
router.post('/courses/new', createCourse);
router.get('/courses', getInstructorCourses);
router.get('/courses/:id', getCourseDetail);
router.patch('/courses/:id/submit', submitCourseForReview);
router.get('/courses/:courseId/students', getEnrolledStudents);
router.delete('/courses/:id/delete', deleteCourse);
router.put('/courses/:id/update', updateCourse);

// Lesson Management
router.post('/courses/:courseId/lessons', addLesson);
router.get('/courses/:courseId/lessons', viewLesson);
router.put('/lessons/:id/update', updateLesson);
router.delete('/lessons/:id/delete', deleteLesson);


// Quiz Management
router.get('/courses/:courseId/quiz', getQuizDetail);
router.post('/courses/:courseId/quiz', createQuiz);
router.post('/quizzes/:quizId/questions', addQuestionToQuiz);
router.delete('/questions/:id', deleteQuestion);
router.get('/quizzes/:quizId/attempts', getQuizAttemptsForInstructor);
router.get('/courses/:courseId/students/:studentId/attempts', getStudentQuizAttemptsForInstructor);

export default router;
