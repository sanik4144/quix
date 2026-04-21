import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import api from '../../services/api';
import { BookOpen, ChevronRight, Clock, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MyLearning = () => {
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEnrollments = async () => {
            try {
                const res = await api.get('/student/enrolled-courses');
                setEnrollments(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchEnrollments();
    }, []);

    if (loading) return <DashboardLayout><p className="loading-text">Loading your courses...</p></DashboardLayout>;

    return (
        <DashboardLayout>
            <div className="page-header">
                <h1>My Learning</h1>
                <p>Access all your enrolled courses and track your progress.</p>
            </div>

            <div className="grid-3" style={{ gap: '2rem' }}>
                {enrollments.length > 0 ? (
                    enrollments.map((env) => (
                        <div key={env.id} className="card card-hover flex-column" style={{ padding: '1.5rem', height: '100%', justifyContent: 'space-between' }}>
                            <div>
                                <div style={{ height: '140px', background: '#f1f5f9', borderRadius: '0.75rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <BookOpen size={40} color="#94a3b8" />
                                </div>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1rem' }}>{env.Course?.title}</h3>
                                
                                <div className="progress-container" style={{ marginBottom: '0.5rem' }}>
                                    <div className="progress-fill" style={{ width: `${env.progress}%` }}></div>
                                </div>
                                <div className="flex-between" style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)' }}>
                                    <span>{env.progress}% Complete</span>
                                    {env.progress === 100 && <span style={{ color: '#15803d', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Award size={14} /> Finished</span>}
                                </div>
                            </div>

                            <button 
                                onClick={() => navigate(`/student/courses/${env.Course?.id}`)}
                                className="btn-primary" 
                                style={{ marginTop: '2rem', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                            >
                                {env.progress === 0 ? 'Start Course' : env.progress === 100 ? 'Review Course' : 'Continue Learning'}
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    ))
                ) : (
                    <div style={{ gridColumn: 'span 3', textAlign: 'center', padding: '4rem' }}>
                        <BookOpen size={64} style={{ margin: '0 auto 1.5rem', color: 'var(--text-muted)', opacity: 0.2 }} />
                        <h2 style={{ marginBottom: '1rem' }}>No Enrolled Courses</h2>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>You haven't started any courses yet. Explore our catalog to begin.</p>
                        <button onClick={() => navigate('/student/browse')} className="btn-primary" style={{ padding: '0.75rem 2.5rem' }}>
                            Browse Catalog
                        </button>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default MyLearning;
