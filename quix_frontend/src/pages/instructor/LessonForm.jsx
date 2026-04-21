import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import api from '../../services/api';
import { Save, X, Info } from 'lucide-react';

const LessonForm = () => {
    const { courseId, lessonId } = useParams();
    const navigate = useNavigate();
    const isEdit = !!lessonId;
    
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        videoUrl: '',
        attachmentUrl: '',
        isFreePreview: false,
        order: 1
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isEdit) {
            const fetchLesson = async () => {
                try {
                    const res = await api.get(`/student/lessons/${lessonId}`);
                    setFormData(res.data);
                } catch (err) {
                    alert('Failed to fetch lesson data');
                }
            };
            fetchLesson();
        }
    }, [lessonId, isEdit]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (isEdit) {
                await api.put(`/instructor/lessons/${lessonId}/update`, formData);
            } else {
                await api.post(`/instructor/courses/${courseId}/lessons`, formData);
            }
            navigate(`/instructor/courses/${courseId}/lessons`);
        } catch (err) {
            alert(err.response?.data?.message || 'Operation failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <div className="page-header">
                    <h1>{isEdit ? 'Edit Lesson' : 'Add New Lesson'}</h1>
                    <p>Provide details for your educational content.</p>
                </div>

                <form onSubmit={handleSubmit} className="card" style={{ marginTop: '2rem', padding: '2.5rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div className="form-group">
                            <label className="form-label">Lesson Title</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                value={formData.title}
                                onChange={(e) => setFormData({...formData, title: e.target.value})}
                                placeholder="e.g. Introduction to React"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Content / Description</label>
                            <textarea 
                                className="form-control" 
                                style={{ minHeight: '150px' }}
                                value={formData.content}
                                onChange={(e) => setFormData({...formData, content: e.target.value})}
                                placeholder="Details about this lesson (supports Markdown)..."
                                required
                            />
                        </div>

                        <div className="grid-2">
                            <div className="form-group">
                                <label className="form-label">Video URL (Optional)</label>
                                <input 
                                    type="url" 
                                    className="form-control" 
                                    value={formData.videoUrl}
                                    onChange={(e) => setFormData({...formData, videoUrl: e.target.value})}
                                    placeholder="YouTube or direct link..."
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Attachment URL (Optional)</label>
                                <input 
                                    type="url" 
                                    className="form-control" 
                                    value={formData.attachmentUrl}
                                    onChange={(e) => setFormData({...formData, attachmentUrl: e.target.value})}
                                    placeholder="Resource PDF or ZIP link..."
                                />
                            </div>
                        </div>

                        <div className="flex-between" style={{ padding: '1.25rem', background: '#f8fafc', borderRadius: '0.75rem', border: '1px solid var(--border)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(99, 102, 241, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Info size={20} color="var(--primary)" />
                                </div>
                                <div>
                                    <div style={{ fontWeight: '600', fontSize: '0.925rem' }}>Free Preview</div>
                                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Allow students to see this without enrollment.</div>
                                </div>
                            </div>
                            <label className="switch">
                                <input 
                                    type="checkbox" 
                                    checked={formData.isFreePreview}
                                    onChange={(e) => setFormData({...formData, isFreePreview: e.target.checked})}
                                />
                                <span className="slider round"></span>
                            </label>
                        </div>

                        <div className="form-group" style={{ maxWidth: '200px' }}>
                            <label className="form-label">Order Index</label>
                            <input 
                                type="number" 
                                className="form-control" 
                                value={formData.order}
                                onChange={(e) => setFormData({...formData, order: parseInt(e.target.value)})}
                                min="1"
                                required
                            />
                        </div>
                    </div>

                    <div style={{ marginTop: '3rem', display: 'flex', gap: '1rem' }}>
                        <button 
                            type="submit" 
                            className="btn-primary" 
                            style={{ flex: 1, padding: '1rem' }}
                            disabled={loading}
                        >
                            <Save size={18} style={{ marginRight: '0.5rem' }} />
                            {loading ? 'Processing...' : (isEdit ? 'Update Lesson' : 'Create Lesson')}
                        </button>
                        <button 
                            type="button" 
                            onClick={() => navigate(-1)}
                            className="btn-primary"
                            style={{ background: 'white', color: 'var(--text)', borderColor: 'var(--border)', padding: '0 2rem' }}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    );
};

export default LessonForm;
