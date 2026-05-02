import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import api from '../../services/api';
import { Users, BookOpen, CheckCircle, Clock } from 'lucide-react';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalCourses: 0,
        pendingApprovals: 0,
        totalEnrollments: 0
    });

    const [courses, setCourses] = useState([]);

    const fetchData = async () => {
        try {
            const statsRes = await api.get('/admin/stats');
            const coursesRes = await api.get('/admin/courses');
            setStats(statsRes.data);
            setCourses(coursesRes.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCoursePublish = async (id) => {
        try {
            await api.patch(`/admin/courses/${id}/status`, { status: 'APPROVED' });
            fetchData();
        } catch (err) {
            alert('Failed to approve course');
        }
    };


    return (
        <DashboardLayout>
            <div className="page-header">
                <h1>Admin Dashboard</h1>
                <p>Welcome back! Here's what's happening on the platform.</p>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon" style={{ backgroundColor: '#e0e7ff', color: '#4338ca' }}>
                        <Users size={24} />
                    </div>
                    <div className="stat-info">
                        <h3>Total Users</h3>
                        <p>{stats.totalUsers}</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ backgroundColor: '#fef3c7', color: '#b45309' }}>
                        <Clock size={24} />
                    </div>
                    <div className="stat-info">
                        <h3>Pending Approvals</h3>
                        <p>{stats.pendingApprovals}</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ backgroundColor: '#dcfce7', color: '#15803d' }}>
                        <BookOpen size={24} />
                    </div>
                    <div className="stat-info">
                        <h3>Total Courses</h3>
                        <p>{stats.totalCourses}</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ backgroundColor: '#f3e8ff', color: '#7e22ce' }}>
                        <CheckCircle size={24} />
                    </div>
                    <div className="stat-info">
                        <h3>Total Enrollments</h3>
                        <p>{stats.totalEnrollments}</p>
                    </div>
                </div>
            </div>

            {/* Course Oversight */}
            <div className="table-container">
                <div className="p-6 border-b" style={{ padding: '1.5rem', borderBottom: '1px solid #e2e8f0' }}>
                    <h2 className="text-xl font-bold">Course Review Queue</h2>
                    <p className="text-sm text-muted">Review and publish pending courses.</p>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Course Title</th>
                            <th>Instructor</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {courses.filter(c => c.status === 'PENDING').map(course => (
                            <tr key={course.id}>
                                <td className="font-medium">{course.title}</td>
                                <td>{course.instructor?.fullName}</td>
                                <td>
                                    <span className="status-badge status-pending">PENDING</span>
                                </td>
                                <td>
                                    <button 
                                        onClick={() => handleCoursePublish(course.id)}
                                        className="btn-primary" 
                                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                                    >
                                        Approve
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {courses.filter(c => c.status === 'PENDING').length === 0 && (
                            <tr>
                                <td colSpan="4" className="text-center p-8 text-muted">No courses waiting for review.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

        </DashboardLayout>
    );
};

export default AdminDashboard;
