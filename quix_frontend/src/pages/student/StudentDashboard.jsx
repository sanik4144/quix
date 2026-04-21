import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import api from '../../services/api';
import { PlayCircle, Award, Clock, BookOpen, ChevronRight, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StudentDashboard = () => {
    const [data, setData] = useState({
        enrollments: [],
        featuredCourses: [],
        recentQuizzes: [],
        lastLesson: null
    });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [enrollRes, browseRes] = await Promise.all([
                    api.get('/student/enrolled-courses'),
                    api.get('/student/courses')
                ]);

                setData({
                    enrollments: enrollRes.data,
                    featuredCourses: browseRes.data.slice(0, 3), // Show first 3 as featured
                    recentQuizzes: [], // Placeholder for attempt history
                    lastLesson: enrollRes.data.find(e => e.progress > 0 && e.progress < 100)
                });
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    if (loading) return <DashboardLayout><p className="loading-text">Loading your dashboard...</p></DashboardLayout>;

    return (
        <DashboardLayout>
            <div className="page-header">
                <h1>Welcome Back!</h1>
                <p>Pick up where you left off and keep growing.</p>
            </div>

            {/* Quick Resume */}
            {data.lastLesson && (
                <div className="card mb-8" style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'linear-gradient(90deg, #6366f1 0%, #a855f7 100%)', color: 'white', border: 'none' }}>
                    <div className="flex-column" style={{ gap: '0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Zap size={20} />
                            <span style={{ fontSize: '0.875rem', fontWeight: '500', opacity: 0.9 }}>QUICK RESUME</span>
                        </div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: '700' }}>{data.lastLesson.Course?.title}</h2>
                    </div>
                    <button 
                        onClick={() => navigate(`/student/courses/${data.lastLesson.Course?.id}`)}
                        className="btn-primary" 
                        style={{ background: 'white', color: 'var(--primary)', padding: '0.75rem 1.5rem', fontWeight: '700', borderRadius: '0.5rem', border: 'none' }}
                    >
                        Resume Course
                    </button>
                </div>
            )}

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon" style={{ backgroundColor: '#e0e7ff', color: '#4338ca' }}>
                        <BookOpen size={24} />
                    </div>
                    <div className="stat-info">
                        <h3>Enrolled Courses</h3>
                        <p>{data.enrollments.length}</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ backgroundColor: '#fef3c7', color: '#b45309' }}>
                        <Clock size={24} />
                    </div>
                    <div className="stat-info">
                        <h3>In Progress</h3>
                        <p>{data.enrollments.filter(e => e.progress < 100).length}</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ backgroundColor: '#dcfce7', color: '#15803d' }}>
                        <Award size={24} />
                    </div>
                    <div className="stat-info">
                        <h3>Certificates</h3>
                        <p>{data.enrollments.filter(e => e.progress === 100).length}</p>
                    </div>
                </div>
            </div>

            <div className="grid-2 mt-8" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '2rem', marginTop: '2.5rem' }}>
                {/* Enrolled Courses */}
                <div>
                    <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: '700' }}>My Learning</h2>
                        {data.enrollments.length > 0 && (
                            <button 
                                onClick={() => navigate('/student/my-learning')}
                                className="btn-text"
                                style={{ color: 'var(--primary)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.25rem', background: 'none', border: 'none', cursor: 'pointer' }}
                            >
                                View All <ChevronRight size={16} />
                            </button>
                        )}
                    </div>
                    <div className="flex-column" style={{ gap: '1rem' }}>
                        {data.enrollments.length > 0 ? (
                            data.enrollments.map((e) => (
                                <div key={e.id} className="card card-hover" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.5rem' }}>
                                    <div style={{ flex: 1 }}>
                                        <h4 style={{ fontWeight: '700', marginBottom: '0.5rem', fontSize: '1.1rem' }}>{e.Course?.title}</h4>
                                        <div className="progress-container">
                                            <div className="progress-fill" style={{ width: `${e.progress}%` }}></div>
                                        </div>
                                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem', fontWeight: '500' }}>{e.progress}% complete</p>
                                    </div>
                                    <button 
                                        onClick={() => navigate(`/student/courses/${e.Course?.id}`)}
                                        className="btn-icon" 
                                        style={{ marginLeft: '1.5rem', background: '#f1f5f9' }}
                                    >
                                        <ChevronRight size={20} />
                                    </button>
                                </div>
                            ))
                        ) : (
                            <div className="card" style={{ textAlign: 'center', padding: '3rem', border: '2px dashed var(--border)' }}>
                                <BookOpen size={48} style={{ margin: '0 auto 1.5rem', color: 'var(--text-muted)', opacity: 0.3 }} />
                                <h3 style={{ marginBottom: '0.5rem' }}>No Courses Yet</h3>
                                <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>You haven't enrolled in any courses yet. Start your journey today!</p>
                                <button 
                                    onClick={() => navigate('/student/browse')}
                                    className="btn-primary"
                                    style={{ padding: '0.75rem 2rem' }}
                                >
                                    Browse Courses
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Featured / Recommended */}
                    {data.featuredCourses.length > 0 && (
                        <div style={{ marginTop: '3rem' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1.5rem' }}>Recommended for You</h2>
                            <div className="grid-2" style={{ gap: '1.5rem' }}>
                                {data.featuredCourses.map(course => (
                                    <div key={course.id} className="card card-hover" style={{ padding: '1.25rem' }}>
                                        <div style={{ height: '120px', background: '#f1f5f9', borderRadius: '0.5rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <BookOpen size={32} color="#94a3b8" />
                                        </div>
                                        <h4 style={{ fontWeight: '700', marginBottom: '0.5rem' }}>{course.title}</h4>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                                            <span style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: '600' }}>{course.category}</span>
                                            <button 
                                                onClick={() => navigate(`/student/courses/${course.id}`)}
                                                className="btn-primary" 
                                                style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}
                                            >
                                                Details
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Recent Activity */}
                <div>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1.5rem' }}>Recent Quizzes</h2>
                    <div className="card" style={{ padding: '1.5rem' }}>
                        {data.recentQuizzes.length > 0 ? (
                            <div className="flex-column">
                                {/* Map actual quiz history here */}
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                                <Award size={32} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
                                <p style={{ fontSize: '0.875rem' }}>No quiz attempts yet. Complete a course to test your skills!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default StudentDashboard;

