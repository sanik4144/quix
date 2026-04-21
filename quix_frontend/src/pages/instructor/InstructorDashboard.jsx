import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import api from '../../services/api';
import { BookOpen, Users, Award, TrendingUp, MoreVertical, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const InstructorDashboard = () => {
    const [stats, setStats] = useState({
        totalCourses: 0,
        totalStudents: 0,
        avgQuizScore: 0
    });
    const [recentCourses, setRecentCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, coursesRes] = await Promise.all([
                    api.get('/instructor/stats'),
                    api.get('/instructor/courses')
                ]);
                setStats(statsRes.data);
                setRecentCourses(coursesRes.data.slice(0, 5));
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case 'APPROVED': return '#22c55e';
            case 'PENDING': return '#f59e0b';
            case 'DRAFT': return '#64748b';
            default: return '#64748b';
        }
    };

    return (
        <DashboardLayout>
            <div className="page-header flex-between">
                <div>
                    <h1>Instructor Dashboard</h1>
                    <p>Track your course performance and student engagement.</p>
                </div>
                <Link to="/instructor/courses/new" className="btn-primary">
                    <Plus size={18} style={{ marginRight: '0.5rem' }} /> Create New Course
                </Link>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', color: 'var(--primary)' }}>
                        <BookOpen size={24} />
                    </div>
                    <div className="stat-info">
                        <h3>Total Courses</h3>
                        <p>{stats.totalCourses}</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)', color: '#22c55e' }}>
                        <Users size={24} />
                    </div>
                    <div className="stat-info">
                        <h3>Total Students</h3>
                        <p>{stats.totalStudents}</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>
                        <Award size={24} />
                    </div>
                    <div className="stat-info">
                        <h3>Avg. Quiz Score</h3>
                        <p>{stats.avgQuizScore}%</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ backgroundColor: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6' }}>
                        <TrendingUp size={24} />
                    </div>
                    <div className="stat-info">
                        <h3>Engagement</h3>
                        <p>High</p>
                    </div>
                </div>
            </div>

            <div className="table-container" style={{ marginTop: '2rem' }}>
                <div className="flex-between" style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: '700' }}>Your Courses</h2>
                    <Link to="/instructor/my-courses" style={{ color: 'var(--primary)', fontWeight: '600', fontSize: '0.875rem' }}>View All</Link>
                </div>
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Course Info</th>
                            <th>Status</th>
                            <th>Category</th>
                            <th>Students</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recentCourses.length > 0 ? (
                            recentCourses.map(course => (
                                <tr key={course.id}>
                                    <td>
                                        <div style={{ fontWeight: '600' }}>{course.title}</div>
                                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Created: {new Date(course.createdAt).toLocaleDateString()}</div>
                                    </td>
                                    <td>
                                        <span 
                                            style={{ 
                                                padding: '0.25rem 0.75rem', 
                                                borderRadius: '9999px', 
                                                fontSize: '0.75rem', 
                                                backgroundColor: `${getStatusColor(course.status)}20`, 
                                                color: getStatusColor(course.status),
                                                fontWeight: '600'
                                            }}
                                        >
                                            {course.status}
                                        </span>
                                    </td>
                                    <td>{course.category}</td>
                                    <td>0</td> {/* Need enrollment count per course */}
                                    <td>
                                        <button className="btn-icon">
                                            <MoreVertical size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                                    No courses found. Start by creating your first course!
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </DashboardLayout>
    );
};

export default InstructorDashboard;
