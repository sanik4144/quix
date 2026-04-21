import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Play, Lock, CheckCircle, BookOpen, User, Clock, Star, HelpCircle } from 'lucide-react';

const CourseView = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const res = await api.get(`/student/courses/${id}`);
                setCourse(res.data);
                console.log(res.data);
                const enrollments = await api.get('/student/enrolled-courses');

                setIsEnrolled(enrollments.data.some(e => e.courseId === id));
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchCourse();
    }, [id]);

    const handleEnroll = async () => {
        try {
            await api.post(`/student/courses/${id}/enroll`);
            setIsEnrolled(true);
            alert('Enrolled successfully!');
        } catch (err) {
            alert(err.response?.data?.message || 'Enrollment failed');
        }
    };

    if (loading) return <DashboardLayout><p>Loading course details...</p></DashboardLayout>;
    if (!course) return <DashboardLayout><p>Course not found</p></DashboardLayout>;

    return (
        <DashboardLayout>
            <div className="grid-2" style={{ gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', alignItems: 'start', gap: '3rem' }}>
                <div>
                    <div className="page-header" style={{ marginBottom: '2rem' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--primary)', textTransform: 'uppercase', marginBottom: '0.5rem', display: 'block' }}>
                            {course.category}
                        </span>
                        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{course.title}</h1>
                        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                                <User size={18} />
                                <span>By {course.instructor?.fullName}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                                <Clock size={18} />
                                <span>Last updated recently</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                                <BookOpen size={18} />
                                <span>{course.Lessons?.length} Lessons</span>
                            </div>
                        </div>
                    </div>

                    <div className="card" style={{ marginBottom: '2.5rem' }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1rem' }}>Description</h2>
                        <div style={{ color: 'var(--text-muted)', lineHeight: '1.7', whiteSpace: 'pre-line' }}>
                            {course.description}
                        </div>
                    </div>

                    <div className="flex-column" style={{ gap: '1.5rem' }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: '700' }}>Course Content</h2>
                        <div className="flex-column" style={{ gap: '0.75rem' }}>
                            {course.Lessons?.sort((a,b) => a.order - b.order).map((lesson) => (
                                <div 
                                    key={lesson.id} 
                                    className={`lesson-item ${isEnrolled || lesson.isFreePreview ? '' : 'locked'}`}
                                    style={{ 
                                        cursor: isEnrolled || lesson.isFreePreview ? 'pointer' : 'default',
                                        opacity: isEnrolled || lesson.isFreePreview ? 1 : 0.6
                                    }}
                                    onClick={() => (isEnrolled || lesson.isFreePreview) && navigate(`/student/lessons/${lesson.id}`)}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                                        {isEnrolled || lesson.isFreePreview ? (
                                            <div className="icon-box" style={{ width: '32px', height: '32px', background: '#eef2ff', color: 'var(--primary)' }}>
                                                <Play size={16} fill="currentColor" />
                                            </div>
                                        ) : (
                                            <div className="icon-box" style={{ width: '32px', height: '32px', background: '#f8fafc', color: '#94a3b8' }}>
                                                <Lock size={16} />
                                            </div>
                                        )}
                                        <span style={{ fontWeight: '500' }}>{lesson.title}</span>
                                    </div>
                                    {lesson.isFreePreview && !isEnrolled && (
                                        <span style={{ fontSize: '0.7rem', fontWeight: '700', background: '#dcfce7', color: '#15803d', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>
                                            PREVIEW
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {course.Quiz && (
                        <div className="flex-column" style={{ gap: '1.5rem', marginTop: '3rem' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: '700' }}>Final Assessment</h2>
                            <div className="card" style={{ padding: '1.5rem', border: '1px solid var(--border)', background: '#f8fafc' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'between', flexWrap: 'wrap', gap: '1.5rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                                        <div className="icon-box" style={{ width: '48px', height: '48px', background: 'var(--primary)', color: 'white' }}>
                                            <HelpCircle size={24} />
                                        </div>
                                        <div>
                                            <h3 style={{ fontWeight: '700', fontSize: '1.1rem', marginBottom: '0.25rem' }}>{course.Quiz.title}</h3>
                                            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                                                {course.Quiz.timeLimit} Minutes • 
                                                {course.Quiz.QuizAttempts?.[0] ? (
                                                    <span style={{ marginLeft: '0.5rem', color: course.Quiz.QuizAttempts[0].status === 'PASS' ? '#16a34a' : '#dc2626' }}>
                                                        Best Score: {course.Quiz.QuizAttempts[0].score}% ({course.Quiz.QuizAttempts[0].status})
                                                    </span>
                                                ) : ' Keep your focus!'}
                                            </p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => isEnrolled ? navigate(`/student/quizzes/${course.Quiz.id}`) : alert('Please enroll to take the quiz')}
                                        className="btn-primary"
                                        style={{ padding: '0.75rem 2rem', opacity: isEnrolled ? 1 : 0.6 }}
                                    >
                                        {course.Quiz.QuizAttempts?.[0] ? 'Retake Quiz' : 'Take Quiz'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="sidebar" style={{ position: 'sticky', top: '2rem' }}>
                    <div className="card" style={{ padding: '0', overflow: 'hidden', boxShadow: 'var(--shadow-lg)' }}>
                        <div style={{ height: '200px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Play size={48} style={{ color: '#cbd5e1' }} />
                        </div>
                        <div style={{ padding: '2rem' }}>
                            <div style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '1.5rem', color: '#1e293b' }}>
                                {course.pricing > 0 ? `$${course.pricing}` : 'Free'}
                            </div>

                            {isEnrolled ? (
                                <button 
                                    onClick={() => navigate(`/student/lessons/${course.Lessons[0]?.id}`)}
                                    className="btn-primary"
                                    style={{ width: '100%', padding: '1rem' }}
                                >
                                    Continue Learning
                                </button>
                            ) : (
                                <button 
                                    onClick={handleEnroll}
                                    className="btn-primary"
                                    style={{ width: '100%', padding: '1rem' }}
                                >
                                    Enroll in Course
                                </button>
                            )}

                            <div className="flex-column" style={{ marginTop: '2rem', gap: '0.75rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.875rem' }}>
                                    <CheckCircle size={16} style={{ color: '#22c55e' }} />
                                    <span>Full lifetime access</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.875rem' }}>
                                    <CheckCircle size={16} style={{ color: '#22c55e' }} />
                                    <span>Access on mobile and web</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.875rem' }}>
                                    <CheckCircle size={16} style={{ color: '#22c55e' }} />
                                    <span>Certificate of completion</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default CourseView;

