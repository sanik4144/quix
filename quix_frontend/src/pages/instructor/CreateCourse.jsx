import { Save, ArrowLeft, Image as ImageIcon, Tag, BarChart, DollarSign } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import api from '../../services/api';

const CreateCourse = () => {
    const [form, setForm] = useState({
        title: '',
        description: '',
        category: '',
        thumbnail: '',
        difficulty: 'Beginner',
        pricing: 0,
        status: 'DRAFT',
    });

    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = Boolean(id);

    useEffect(() => {
        if (isEditMode) {
            const fetchCourse = async () => {
                try {
                    const res = await api.get(`/instructor/courses/${id}`);
                    setForm(res.data);
                } catch (err) {
                    alert('Failed to fetch course details');
                    navigate('/instructor/my-courses');
                }
            };
            fetchCourse();
        }
    }, [id, isEditMode, navigate]);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.type === 'number' ? parseFloat(e.target.value) : e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (isEditMode) {
                await api.put(`/instructor/courses/${id}/update`, form);
                alert('Course updated successfully and sent for review!');
            } else {
                await api.post('/instructor/courses/new', form);
                alert('Course created successfully!');
            }
            navigate('/instructor/my-courses');
        } catch (err) {
            alert(err.response?.data?.message || 'Operation failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout>
            <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                <div className="page-header">
                    <button onClick={() => navigate(-1)} className="btn-icon" style={{ marginBottom: '1rem' }}>
                        <ArrowLeft size={20} />
                    </button>
                    <h1>{isEditMode ? 'Edit Course' : 'Create New Course'}</h1>
                    <p>{isEditMode ? 'Update your course content and maintain excellence.' : 'Launch your educational journey by creating a premium learning experience.'}</p>
                </div>

                <form onSubmit={handleSubmit} className="card" style={{ marginTop: '2rem', padding: '2.5rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        
                        <div className="form-group">
                            <label className="form-label">Course Title</label>
                            <input
                                type="text"
                                name="title"
                                className="form-control"
                                placeholder="e.g. Advanced Web Development with React"
                                value={form.title}
                                onChange={handleChange}
                                required
                                style={{ fontSize: '1.1rem', fontWeight: '600' }}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Description</label>
                            <textarea
                                name="description"
                                className="form-control"
                                placeholder="Provide a detailed overview of what students will learn..."
                                value={form.description}
                                onChange={handleChange}
                                rows="6"
                                required
                            />
                        </div>

                        <div className="grid-2">
                            <div className="form-group">
                                <label className="form-label"><Tag size={16} /> Category</label>
                                <input
                                    type="text"
                                    name="category"
                                    className="form-control"
                                    placeholder="e.g. Programming, Marketing"
                                    value={form.category}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label"><ImageIcon size={16} /> Thumbnail URL</label>
                                <input
                                    type="text"
                                    name="thumbnail"
                                    className="form-control"
                                    placeholder="Paste high-quality image URL"
                                    value={form.thumbnail}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid-2">
                            <div className="form-group">
                                <label className="form-label"><BarChart size={16} /> Difficulty Level</label>
                                <select
                                    name="difficulty"
                                    className="form-control"
                                    value={form.difficulty}
                                    onChange={handleChange}
                                >
                                    <option value="Beginner">Beginner</option>
                                    <option value="Intermediate">Intermediate</option>
                                    <option value="Advanced">Advanced</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label"><DollarSign size={16} /> Pricing ($)</label>
                                <input
                                    type="number"
                                    name="pricing"
                                    className="form-control"
                                    placeholder="0 for Free"
                                    value={form.pricing}
                                    onChange={handleChange}
                                    min="0"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div style={{ marginTop: '3.5rem', display: 'flex', gap: '1.5rem' }}>
                        <button 
                            type="submit" 
                            className="btn-primary" 
                            style={{ flex: 2, padding: '1.25rem', fontSize: '1rem' }}
                            disabled={loading}
                        >
                            <Save size={20} style={{ marginRight: '0.75rem' }} />
                            {loading ? (isEditMode ? 'Updating Course...' : 'Designing Your Course...') : (isEditMode ? 'Update & Submit for Review' : 'Publish Course Draft')}
                        </button>
                        <button 
                            type="button" 
                            onClick={() => navigate(-1)}
                            className="btn-primary"
                            style={{ flex: 1, background: 'white', color: 'var(--text)', borderColor: 'var(--border)' }}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    );
};

export default CreateCourse;