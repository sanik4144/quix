import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import api from '../../services/api';
import { ChevronLeft, CheckCircle, PlayCircle, FileText, Lock } from 'lucide-react';

const LessonPlayer = () => {
    const { lessonId } = useParams();
    const navigate = useNavigate();
    const [lesson, setLesson] = useState(null);
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isCompleting, setIsCompleting] = useState(false);

    useEffect(() => {
        const fetchLesson = async () => {
            setLoading(true);
            try {
                const res = await api.get(`/student/lessons/${lessonId}`);
                setLesson(res.data);
                
                const courseRes = await api.get(`/student/courses/${res.data.courseId}`);
                setCourse(courseRes.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchLesson();
    }, [lessonId]);

    const handleComplete = async () => {
        setIsCompleting(true);
        try {
            await api.post(`/student/lessons/${lessonId}/complete`);
            
            // Find next lesson
            const currentOrder = lesson.order;
            const lessons = course.Lessons.sort((a, b) => a.order - b.order);
            const nextLesson = lessons.find(l => l.order > currentOrder);
            
            if (nextLesson) {
                navigate(`/student/lessons/${nextLesson.id}`);
            } else if (course.Quiz) {
                navigate(`/student/quizzes/${course.Quiz.id}`);
            } else {
                navigate(`/student/courses/${course.id}`);
            }
        } catch (err) {
            console.error(err);
            alert('Failed to mark lesson as complete');
        } finally {
            setIsCompleting(false);
        }
    };

    if (loading) return <DashboardLayout><p>Loading lesson...</p></DashboardLayout>;
    if (!lesson) return <DashboardLayout><p>Lesson not found</p></DashboardLayout>;

    return (
        <DashboardLayout>
            <div style={{ marginBottom: '1.5rem' }}>
                <Link to={`/student/courses/${lesson.courseId}`} className="flex-between" style={{ width: 'fit-content', gap: '0.5rem', color: 'var(--primary)', textDecoration: 'none', fontWeight: '600' }}>
                    <ChevronLeft size={20} /> Back to Course
                </Link>
            </div>

            <div className="grid-2" style={{ gridTemplateColumns: 'minmax(0, 3fr) minmax(0, 1fr)', alignItems: 'start' }}>
                <div className="player-main">
                    <div style={{ background: '#000', borderRadius: '1rem', overflow: 'hidden', aspectRatio: '16/9', marginBottom: '2rem', boxShadow: 'var(--shadow-lg)' }}>
                        {lesson.videoUrl ? (
                            <iframe 
                                width="100%" 
                                height="100%" 
                                src={lesson.videoUrl.replace('watch?v=', 'embed/')} 
                                title={lesson.title}
                                frameBorder="0" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                allowFullScreen
                            ></iframe>
                        ) : (
                            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white', opacity: 0.5 }}>
                                <PlayCircle size={64} style={{ marginBottom: '1rem' }} />
                                <p>No video available for this lesson</p>
                            </div>
                        )}
                    </div>

                    <div className="card">
                        <div className="flex-between" style={{ marginBottom: '2rem', borderBottom: '1px solid var(--border)', paddingBottom: '1.5rem' }}>
                            <h1 style={{ fontSize: '1.75rem', fontWeight: '800' }}>{lesson.title}</h1>
                            <button 
                                onClick={handleComplete}
                                disabled={isCompleting}
                                className="btn-primary" 
                                style={{ background: '#22c55e', borderColor: '#22c55e', padding: '0.75rem 1.5rem' }}
                            >
                                {isCompleting ? 'Saving...' : 'Mark as Complete'}
                            </button>
                        </div>

                        <div style={{ lineHeight: '1.8', color: '#334155', fontSize: '1.1rem' }}>
                            {lesson.content}
                        </div>

                        {lesson.attachmentUrl && (
                            <div style={{ marginTop: '3rem', padding: '1.5rem', background: '#f8fafc', borderRadius: '1rem', border: '1px solid var(--border)' }}>
                                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', fontSize: '1rem' }}>
                                    <FileText size={20} style={{ color: 'var(--primary)' }} />
                                    Lesson Resources
                                </h3>
                                <a href={lesson.attachmentUrl} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ display: 'inline-flex', background: 'white', color: 'var(--primary)', border: '1px solid var(--primary)', padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
                                    View Materials
                                </a>
                            </div>
                        )}
                    </div>
                </div>

                <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
                    <div style={{ padding: '1.25rem', background: '#f8fafc', borderBottom: '1px solid var(--border)', fontWeight: '700' }}>
                        Course Content
                    </div>
                    <div style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
                        {course?.Lessons?.sort((a,b) => a.order - b.order).map((l, idx) => (
                            <div 
                                key={l.id} 
                                className={`lesson-item ${l.id === lessonId ? 'active' : ''}`}
                                style={{ 
                                    padding: '1.25rem', 
                                    borderBottom: '1px solid var(--border)', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: '1rem',
                                    cursor: 'pointer',
                                    background: l.id === lessonId ? '#f5f3ff' : 'transparent',
                                    borderLeft: l.id === lessonId ? '4px solid var(--primary)' : 'none'
                                }}
                                onClick={() => navigate(`/student/lessons/${l.id}`)}
                            >
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', width: '20px' }}>{idx + 1}</span>
                                <span style={{ fontSize: '0.875rem', fontWeight: l.id === lessonId ? '700' : '500', flex: 1 }}>{l.title}</span>
                                <PlayCircle size={16} style={{ color: l.id === lessonId ? 'var(--primary)' : '#cbd5e1' }} />
                            </div>
                        ))}

                        {course?.Quiz && (
                             <div 
                                style={{ padding: '1.25rem', background: '#4f46e5', color: 'white', display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }}
                                onClick={() => navigate(`/student/quizzes/${course.Quiz.id}`)}
                            >
                                <CheckCircle size={18} />
                                <span style={{ fontSize: '0.875rem', fontWeight: '700' }}>Final Quiz</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default LessonPlayer;

