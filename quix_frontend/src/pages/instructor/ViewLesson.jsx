import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import api from '../../services/api';
import { Plus, Edit2, Trash2, Video, FileText, ChevronLeft, ArrowUp, ArrowDown, Settings, ArrowLeft, Play } from 'lucide-react';

const ViewLesson = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [lessons, setLessons] = useState([]);
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const lessonsRes = await api.get(`/instructor/courses/${courseId}/lessons`);
            setLessons(lessonsRes.data.lessons);
            
            const courseRes = await api.get(`/student/courses/${courseId}`);
            setCourse(courseRes.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [courseId]);

    const handleMove = async (id, direction) => {
        const index = lessons.findIndex(l => l.id === id);
        if ((direction === 'up' && index === 0) || (direction === 'down' && index === lessons.length - 1)) return;

        const newLessons = [...lessons];
        const swapIndex = direction === 'up' ? index - 1 : index + 1;
        [newLessons[index], newLessons[swapIndex]] = [newLessons[swapIndex], newLessons[index]];

        const updatedLessons = newLessons.map((l, i) => ({ ...l, order: i + 1 }));
        setLessons(updatedLessons);

        try {
            await Promise.all([
                api.put(`/instructor/lessons/${updatedLessons[index].id}/update`, { order: updatedLessons[index].order }),
                api.put(`/instructor/lessons/${updatedLessons[swapIndex].id}/update`, { order: updatedLessons[swapIndex].order })
            ]);
        } catch (err) {
            console.error('Reordering failed:', err);
            fetchData();
        }
    };

    const handleDelete = async (lessonId) => {
        if (window.confirm('Delete this lesson?')) {
            try {
                await api.delete(`/instructor/lessons/${lessonId}/delete`);
                fetchData();
            } catch (err) {
                alert(err.response?.data?.message || 'Delete failed');
            }
        }
    };


    if (loading) return <DashboardLayout><div className="flex-center" style={{ height: '50vh' }}>Loading lessons...</div></DashboardLayout>;

    return (
        <DashboardLayout>
            <div className="page-header flex-between">
                <div>
                    <button onClick={() => navigate('/instructor/my-courses')} className="btn-icon" style={{ marginBottom: '1rem' }}>
                        <ArrowLeft size={20} />
                    </button>
                    <h1>Lessons: {course?.title}</h1>
                    <p>Manage content, videos, and resources for this course.</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button 
                        onClick={() => navigate(`/instructor/courses/${courseId}/quiz`)}
                        className="btn-primary"
                        style={{ backgroundColor: '#8b5cf6', borderColor: '#8b5cf6' }}
                    >
                        <Settings size={20} style={{ marginRight: '0.5rem' }} />
                        Manage Quiz
                    </button>
                    <button 
                        onClick={() => navigate(`/instructor/courses/${courseId}/lessons/new`)}
                        className="btn-primary"
                    >
                        <Plus size={20} style={{ marginRight: '0.5rem' }} />
                        Add New Lesson
                    </button>
                </div>
            </div>

            <div className="table-container">
                <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', fontWeight: '700' }}>
                    Course Modules ({lessons.length})
                </div>
                <div className="lesson-list">
                    {lessons.length > 0 ? (
                        lessons.map((lesson, index) => (
                            <div 
                                key={lesson.id} 
                                className="flex-between"
                                style={{ 
                                    padding: '1rem 1.5rem', 
                                    borderBottom: index === lessons.length - 1 ? 'none' : '1px solid var(--border)',
                                    background: lesson.isFreePreview ? 'rgba(34, 197, 94, 0.05)' : 'transparent'
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{ color: '#94a3b8', fontWeight: '700', width: '20px' }}>{index + 1}</div>
                                    <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        {lesson.videoUrl ? <Play size={18} color="var(--primary)" /> : <FileText size={18} color="#64748b" />}
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: '600' }}>{lesson.title}</div>
                                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                                            {lesson.isFreePreview ? (
                                                <span style={{ color: '#22c55e', fontWeight: '600' }}>Free Preview</span>
                                            ) : (
                                                <span>Locked</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <button 
                                        className="btn-icon" 
                                        onClick={() => handleMove(lesson.id, 'up')}
                                        disabled={index === 0}
                                        style={{ opacity: index === 0 ? 0.3 : 1 }}
                                    >
                                        <ArrowUp size={16} />
                                    </button>
                                    <button 
                                        className="btn-icon" 
                                        onClick={() => handleMove(lesson.id, 'down')}
                                        disabled={index === lessons.length - 1}
                                        style={{ opacity: index === lessons.length - 1 ? 0.3 : 1 }}
                                    >
                                        <ArrowDown size={16} />
                                    </button>
                                    <div style={{ width: '1px', height: '24px', background: 'var(--border)', margin: '0 0.5rem' }}></div>
                                    <button 
                                        className="btn-icon" 
                                        onClick={() => navigate(`/instructor/courses/${courseId}/lessons/${lesson.id}/edit`)}
                                    >
                                        <Edit2 size={16} color="var(--primary)" />
                                    </button>
                                    <button 
                                        className="btn-icon" 
                                        onClick={() => handleDelete(lesson.id)}
                                    >
                                        <Trash2 size={16} color="#ef4444" />
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div style={{ padding: '4rem', textAlign: 'center', color: '#64748b' }}>
                            No lessons found for this course. Start by adding one!
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default ViewLesson;