import { Course, Lesson, Quiz, Question, User, Enrollment, QuizAttempt } from '../models/index.js';
import { Op } from 'sequelize';

// Dashboard Stats
export const getDashboardStats = async (req, res) => {
    try {
        const instructorId = req.user.id;
        const courses = await Course.findAll({ where: { instructorId }, attributes: ['id'] });
        const courseIds = courses.map(c => c.id);

        const totalCourses = courses.length;
        const totalStudents = await Enrollment.count({ where: { courseId: { [Op.in]: courseIds } } });
        
        const quizAttempts = await QuizAttempt.findAll({
            include: [{
                model: Quiz,
                where: { courseId: { [Op.in]: courseIds } }
            }]
        });

        const totalAttempts = quizAttempts.length;
        const avgQuizScore = totalAttempts > 0 
            ? Math.round(quizAttempts.reduce((acc, curr) => acc + curr.score, 0) / totalAttempts)
            : 0;

        res.json({
            totalCourses,
            totalStudents,
            avgQuizScore
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Course Management
export const createCourse = async (req, res) => {
    try {
        const { title, description, category, thumbnail, difficulty, pricing } = req.body;
        const course = await Course.create({
            title,
            description,
            category,
            thumbnail,
            difficulty,
            pricing,
            instructorId: req.user.id,
            status: 'DRAFT'
        });
        res.status(201).json(course);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteCourse = async (req, res) =>{
    try {
        const {id} = req.params;
        const deleted = await Course.destroy({ where: { id, instructorId: req.user.id } });

        if (!deleted) return res.status(404).json({ message: "Course not found" });
        res.json({ message: "Deleted Successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getInstructorCourses = async (req, res) => {
    try {
        const courses = await Course.findAll({
            where: { instructorId: req.user.id },
            order: [['createdAt', 'DESC']]
        });
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getCourseDetail = async (req, res) => {
    try {
        const { id } = req.params;
        const course = await Course.findOne({
            where: { id, instructorId: req.user.id }
        });
        if (!course) return res.status(404).json({ message: 'Course not found' });
        res.json(course);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateCourse = async (req, res) =>{
    try {
        const {id} = req.params;
        const { title, description, category, thumbnail, difficulty, pricing } = req.body;
        await Course.update(
            { title, description, category, thumbnail, difficulty, pricing, status: 'PENDING' },
            { where: { id, instructorId: req.user.id } }
        )

        res.status(200).json({ message: "Course Updated Successfully and sent for review" })
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

export const submitCourseForReview = async (req, res) => {
    try {
        const { id } = req.params;
        const course = await Course.findOne({ where: { id, instructorId: req.user.id } });
        if (!course) return res.status(404).json({ message: 'Course not found' });

        course.status = 'PENDING';
        await course.save();
        res.json({ message: 'Course submitted for review', course });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Lesson Management
export const addLesson = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { title, content, videoUrl, attachmentUrl, isFreePreview } = req.body;

        const course = await Course.findOne({ where: { id: courseId, instructorId: req.user.id } });
        if (!course) return res.status(403).json({ message: 'Unauthorized' });

        const lesson = await Lesson.create({
            courseId,
            title,
            content,
            videoUrl,
            attachmentUrl,
            isFreePreview,
            order: (await Lesson.count({ where: { courseId } })) + 1
        });
        res.status(201).json(lesson);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const viewLesson = async (req, res)=>{
    try {
        const { courseId } = req.params;
        const lessons = await Lesson.findAll({
            where: { courseId },
            order: [['order', 'ASC']]
        });
        res.status(200).json({ lessons });
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

export const updateLesson = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, videoUrl, attachmentUrl, isFreePreview, order } = req.body;
        const lesson = await Lesson.findByPk(id);
        if (!lesson) return res.status(404).json({ message: 'Lesson not found' });
        const course = await Course.findOne({ where: { id: lesson.courseId, instructorId: req.user.id } });
        if (!course) return res.status(403).json({ message: 'Unauthorized' });
        await lesson.update({ title, content, videoUrl, attachmentUrl, isFreePreview, order });
        res.json({ message: 'Lesson updated successfully', lesson });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteLesson = async (req, res) => {
    try {
        const { id } = req.params;
        const lesson = await Lesson.findByPk(id);
        if (!lesson) return res.status(404).json({ message: 'Lesson not found' });
        const course = await Course.findOne({ where: { id: lesson.courseId, instructorId: req.user.id } });
        if (!course) return res.status(403).json({ message: 'Unauthorized' });
        await lesson.destroy();
        res.json({ message: 'Lesson deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Quiz Management
export const getQuizDetail = async (req, res) => {
    try {
        const { courseId } = req.params;
        const quiz = await Quiz.findOne({
            where: { courseId },
            include: [{ model: Question }]
        });
        res.json(quiz);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createQuiz = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { title, timeLimit, passPercentage } = req.body;
        const course = await Course.findOne({ where: { id: courseId, instructorId: req.user.id } });
        if (!course) return res.status(403).json({ message: 'Unauthorized' });

        const [quiz, created] = await Quiz.findOrCreate({
            where: { courseId },
            defaults: { title, timeLimit, passPercentage }
        });

        if (!created) {
            await quiz.update({ title, timeLimit, passPercentage });
        }
        res.status(201).json(quiz);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const addQuestionToQuiz = async (req, res) => {
    try {
        const { quizId } = req.params;
        const { questionText, options, correctAnswer } = req.body;
        const question = await Question.create({ quizId, questionText, options: JSON.stringify(options), correctAnswer });
        res.status(201).json(question);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteQuestion = async (req, res) => {
    try {
        const { id } = req.params;
        await Question.destroy({ where: { id } });
        res.json({ message: 'Question deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getEnrolledStudents = async (req, res) => {
    try {
        const { courseId } = req.params;
        const enrollments = await Enrollment.findAll({
            where: { courseId },
            include: [{ model: User, as: 'student', attributes: ['fullName', 'email'] }]
        });
        res.json(enrollments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getQuizAttemptsForInstructor = async (req, res) => {
    try {
        const { quizId } = req.params;
        const attempts = await QuizAttempt.findAll({
            where: { quizId },
            include: [{ model: User, as: 'student', attributes: ['fullName', 'email'] }],
            order: [['createdAt', 'DESC']]
        });
        res.json(attempts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

