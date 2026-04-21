import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import AdminCourseManagement from './pages/admin/AdminCourseManagement';
import InstructorDashboard from './pages/instructor/InstructorDashboard';
import CreateCourse from './pages/instructor/CreateCourse';
import CourseManagement from './pages/instructor/CourseManagement';
// import CourseEditor from './pages/instructor/CourseEditor';
import ViewLesson from './pages/instructor/ViewLesson';
import LessonForm from './pages/instructor/LessonForm';
import StudentDashboard from './pages/student/StudentDashboard';
import MyLearning from './pages/student/MyLearning';



import BrowseCourses from './pages/student/BrowseCourses';
import CourseView from './pages/student/CourseView';
import LessonPlayer from './pages/student/LessonPlayer';
import QuizInterface from './pages/student/QuizInterface';
import CertificateView from './pages/student/CertificateView';
import EnrolledStudents from './pages/instructor/EnrolledStudents';
import QuizManagement from './pages/instructor/QuizManagement';
import './index.css';





const PrivateRoute = ({ children, allowedRoles = [] }) => {
    const { user, loading } = useAuth();

    if (loading) return <div>Loading...</div>;
    if (!user) return <Navigate to="/login" />;
    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        return <Navigate to="/" />;
    }

    return children;
};

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Protected Routes */}
                    <Route path="/admin" element={
                        <PrivateRoute allowedRoles={['Super Admin', 'Admin']}>
                            <AdminDashboard />
                        </PrivateRoute>
                    } />
                    <Route path="/admin/users" element={
                        <PrivateRoute allowedRoles={['Super Admin', 'Admin']}>
                            <UserManagement />
                        </PrivateRoute>
                    } />
                    <Route path="/admin/courses" element={
                        <PrivateRoute allowedRoles={['Super Admin', 'Admin']}>
                            <AdminCourseManagement />
                        </PrivateRoute>
                    } />

                    
                    <Route path="/instructor" element={
                        <PrivateRoute allowedRoles={['Instructor']}>
                            <InstructorDashboard />
                        </PrivateRoute>
                    } />
                    <Route path="/instructor/my-courses" element={
                        <PrivateRoute allowedRoles={['Instructor']}>
                            <CourseManagement />
                        </PrivateRoute>
                    } />
                    <Route path="/instructor/courses/new" element={
                        <PrivateRoute allowedRoles={['Instructor']}>
                            <CreateCourse />
                        </PrivateRoute>
                    } />
                    <Route path="/instructor/courses/:id/edit" element={
                        <PrivateRoute allowedRoles={['Instructor']}>
                            <CreateCourse />
                        </PrivateRoute>
                    } />
                    <Route path="/instructor/courses/:courseId/lessons" element={
                        <PrivateRoute allowedRoles={['Instructor']}>
                            <ViewLesson />
                        </PrivateRoute>
                    } />
                    <Route path="/instructor/courses/:courseId/lessons/new" element={
                        <PrivateRoute allowedRoles={['Instructor']}>
                            <LessonForm />
                        </PrivateRoute>
                    } />
                    <Route path="/instructor/courses/:courseId/lessons/:lessonId/edit" element={
                        <PrivateRoute allowedRoles={['Instructor']}>
                            <LessonForm />
                        </PrivateRoute>
                    } />                    
                    <Route path="/instructor/courses/:courseId/students" element={
                        <PrivateRoute allowedRoles={['Instructor']}>
                            <EnrolledStudents />
                        </PrivateRoute>
                    } />
                    <Route path="/instructor/courses/:courseId/quiz" element={
                        <PrivateRoute allowedRoles={['Instructor']}>
                            <QuizManagement />
                        </PrivateRoute>
                    } />


                    {/* <Route path="/instructor/courses/:id" element={
                        <PrivateRoute allowedRoles={['Instructor']}>
                            <CourseEditor />
                        </PrivateRoute>
                    } /> */}

                    <Route path="/student" element={
                        <PrivateRoute allowedRoles={['Student']}>
                            <StudentDashboard />
                        </PrivateRoute>
                    } />
                    <Route path="/student/browse" element={
                        <PrivateRoute allowedRoles={['Student']}>
                            <BrowseCourses />
                        </PrivateRoute>
                    } />
                    <Route path="/student/my-learning" element={
                        <PrivateRoute allowedRoles={['Student']}>
                            <MyLearning />
                        </PrivateRoute>
                    } />
                    <Route path="/student/courses/:id" element={
                        <PrivateRoute allowedRoles={['Student']}>
                            <CourseView />
                        </PrivateRoute>
                    } />
                    <Route path="/student/lessons/:lessonId" element={
                        <PrivateRoute allowedRoles={['Student']}>
                            <LessonPlayer />
                        </PrivateRoute>
                    } />
                    <Route path="/student/quizzes/:quizId" element={
                        <PrivateRoute allowedRoles={['Student']}>
                            <QuizInterface />
                        </PrivateRoute>
                    } />
                    <Route path="/student/certificates/:attemptId" element={
                        <PrivateRoute allowedRoles={['Student']}>
                            <CertificateView />
                        </PrivateRoute>
                    } />




                    {/* Default Route */}
                    <Route path="/" element={<Navigate to="/login" />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;

