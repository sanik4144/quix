import express from 'express';
import { 
    getCourses, 
    getCourseDetail, 
    enrollInCourse,
    getEnrolledCourses,
    getLessonContent,
    markLessonComplete,
    submitQuizAttempt,
    getQuizDetail
} from '../controllers/studentController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticate);
router.use(authorize(['student']));

// Discovery
router.get('/courses', getCourses);
router.get('/courses/:id', getCourseDetail);

// Enrollment
router.post('/courses/:courseId/enroll', enrollInCourse);
router.get('/enrolled-courses', getEnrolledCourses);

// Learning
router.get('/lessons/:lessonId', getLessonContent);
router.post('/lessons/:lessonId/complete', markLessonComplete);

// Quiz
router.get('/quizzes/:quizId', getQuizDetail);
router.post('/quizzes/:quizId/attempt', submitQuizAttempt);

export default router;
