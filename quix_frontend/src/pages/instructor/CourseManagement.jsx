import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import api from '../../services/api';
import { Plus, Edit2, Trash2, Eye, Send, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CourseManagement = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchCourses = async () => {
        try {
            const res = await api.get('/instructor/courses');
            setCourses(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    const handleSubmitForReview = async (id) => {
        try {
            await api.patch(`/instructor/courses/${id}/submit`);
            fetchCourses();
        } catch (err) {
            alert(err.response?.data?.message || 'Submission failed');
        }
    };

    const deleteCourse = async (id) =>{
        if (!window.confirm('Are you sure you want to delete this course?')) return;
        try {
            await api.delete(`/instructor/courses/${id}/delete`);
            fetchCourses();
        } catch (error) {
            alert(error.response?.data?.message || 'Deletion Failed');
        }
    }

    return (
        <DashboardLayout>
            <div className="page-header flex-between">
                <div>
                    <h1>My Courses</h1>
                    <p>Create and manage your educational content.</p>
                </div>
                <button 
                    onClick={() => navigate('/instructor/courses/new')}
                    className="btn-primary"
                >
                    <Plus size={20} style={{ marginRight: '0.5rem' }} />
                    Create New Course
                </button>
            </div>

            <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Course Title</th>
                            <th>Category</th>
                            <th>Difficulty</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {courses.map((course) => (
                            <tr key={course.id}>
                                <td style={{ fontWeight: '600' }}>{course.title}</td>
                                <td>{course.category}</td>
                                <td>{course.difficulty}</td>
                                <td>
                                    <span className={`status-badge status-${course.status.toLowerCase()}`}>
                                        {course.status}
                                    </span>
                                </td>
                                <td>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button className="btn-icon" title="Edit" onClick={() => navigate(`/instructor/courses/${course.id}/edit`)}>
                                            <Edit2 size={18} color="var(--primary)" />
                                        </button>
                                        <button 
                                            onClick={()=> navigate(`/instructor/courses/${course.id}/lessons`)}
                                            className="btn-icon" 
                                            title="Lessons"
                                        >
                                            <Eye size={18} color="#f59e0b" />
                                        </button>
                                        <button 
                                            onClick={()=> navigate(`/instructor/courses/${course.id}/students`)}
                                            className="btn-icon" 
                                            title="Enrolled Students"
                                        >
                                            <Users size={18} color="#8b5cf6" />
                                        </button>
                                        {course.status === 'DRAFT' && (
                                            <button 
                                                onClick={() => handleSubmitForReview(course.id)}
                                                className="btn-icon" 
                                                title="Submit for Review"
                                            >
                                                <Send size={18} color="#22c55e" />
                                            </button>
                                        )}
                                        <button
                                            onClick={()=> deleteCourse(course.id)}
                                            className="btn-icon" 
                                            title="Delete">
                                            <Trash2 size={18} color="#ef4444" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {courses.length === 0 && !loading && (
                    <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
                        You haven't created any courses yet.
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default CourseManagement;
