import { Course, Lesson, Quiz, Question, User, Enrollment, LessonCompletion, QuizAttempt } from '../models/index.js';
import { Op } from 'sequelize';

// Course Discovery
export const getCourses = async (req, res) => {
    try {
        const { category, difficulty, search } = req.query;
        const where = { status: 'APPROVED' };

        if (category) where.category = category;
        if (difficulty) where.difficulty = difficulty;
        if (search) {
            where.title = { [Op.like]: `%${search}%` };
        }

        const courses = await Course.findAll({
            where,
            include: [{ model: User, as: 'instructor', attributes: ['fullName'] }]
        });
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getCourseDetail = async (req, res) => {
    try {
        const { id } = req.params;
        const course = await Course.findByPk(id, {
            include: [
                { model: User, as: 'instructor', attributes: ['fullName'] },
                { model: Lesson, attributes: ['id', 'title', 'isFreePreview', 'order'] },
                { 
                    model: Quiz, 
                    attributes: ['id', 'title', 'timeLimit', 'passPercentage'],
                    include: [{
                        model: QuizAttempt,
                        where: { studentId: req.user.id },
                        required: false,
                        limit: 1,
                        order: [['score', 'DESC']]
                    }]
                }
            ]
        });
        if (!course) return res.status(404).json({ message: 'Course not found' });
        res.json(course);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Enrollment
export const enrollInCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const studentId = req.user.id;

        // Check if already enrolled
        const existing = await Enrollment.findOne({ where: { studentId, courseId } });
        if (existing) return res.status(400).json({ message: 'Already enrolled' });

        const enrollment = await Enrollment.create({ studentId, courseId });
        res.status(201).json(enrollment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getEnrolledCourses = async (req, res) => {
    try {
        const enrollments = await Enrollment.findAll({
            where: { studentId: req.user.id },
            include: [{ model: Course }]
        });
        res.json(enrollments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Learning
export const getLessonContent = async (req, res) => {
    try {
        const { lessonId } = req.params;
        const lesson = await Lesson.findByPk(lessonId);
        if (!lesson) return res.status(404).json({ message: 'Lesson not found' });

        // Check enrollment if not free preview
        if (!lesson.isFreePreview) {
            const enrollment = await Enrollment.findOne({ 
                where: { studentId: req.user.id, courseId: lesson.courseId } 
            });
            if (!enrollment) return res.status(403).json({ message: 'Not enrolled in this course' });
        }

        res.json(lesson);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const markLessonComplete = async (req, res) => {
    try {
        const { lessonId } = req.params;
        const lesson = await Lesson.findByPk(lessonId);
        if (!lesson) return res.status(404).json({ message: 'Lesson not found' });

        const enrollment = await Enrollment.findOne({ 
            where: { studentId: req.user.id, courseId: lesson.courseId } 
        });
        if (!enrollment) return res.status(403).json({ message: 'Not enrolled' });

        await LessonCompletion.findOrCreate({
            where: { enrollmentId: enrollment.id, lessonId }
        });

        // Update progress
        const totalLessons = await Lesson.count({ where: { courseId: lesson.courseId } });
        const completedLessons = await LessonCompletion.count({ where: { enrollmentId: enrollment.id } });
        enrollment.progress = Math.round((completedLessons / totalLessons) * 100);
        await enrollment.save();

        res.json({ message: 'Lesson marked as complete', progress: enrollment.progress });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Quiz
export const getQuizDetail = async (req, res) => {
    try {
        const { quizId } = req.params;
        const quiz = await Quiz.findByPk(quizId, {
            include: [{ model: Question, attributes: ['id', 'questionText', 'options'] }]
        });
        if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

        // Check if student is enrolled in the course associated with this quiz
        const enrollment = await Enrollment.findOne({
            where: { studentId: req.user.id, courseId: quiz.courseId }
        });
        if (!enrollment) return res.status(403).json({ message: 'Not enrolled in this course' });

        res.json(quiz);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const submitQuizAttempt = async (req, res) => {
    try {
        const { quizId } = req.params;
        const { answers } = req.body; // Array of { questionId, answer }

        const quiz = await Quiz.findByPk(quizId, {
            include: [{ model: Question }]
        });
        if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

        let correctCount = 0;
        quiz.Questions.forEach(q => {
            const studentAns = answers.find(a => a.questionId === q.id)?.selectedOption;
            if (studentAns !== undefined && studentAns.toString() === q.correctAnswer.toString()) correctCount++;
        });

        const score = Math.round((correctCount / quiz.Questions.length) * 100);
        const status = score >= quiz.passPercentage ? 'PASS' : 'FAIL';

        const attempt = await QuizAttempt.create({
            studentId: req.user.id,
            quizId,
            score,
            status
        });

        res.json(attempt);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};export const getQuizAttempt = async (req, res) => {
    try {
        const { attemptId } = req.params;
        const attempt = await QuizAttempt.findOne({
            where: { id: attemptId, studentId: req.user.id },
            include: [{
                model: Quiz,
                include: [{ model: Course, attributes: ['title'] }]
            }]
        });
        if (!attempt) return res.status(404).json({ message: 'Attempt not found' });
        res.json(attempt);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
