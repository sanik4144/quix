import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import api from '../../services/api';
import { Plus, Trash2, Save, Users, List, HelpCircle, Clock, Award } from 'lucide-react';

const QuizManagement = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [quiz, setQuiz] = useState({ title: '', timeLimit: 30, passPercentage: 70, Questions: [] });
    const [attempts, setAttempts] = useState([]);
    const [activeTab, setActiveTab] = useState('questions');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [showQuestionForm, setShowQuestionForm] = useState(false);
    const [newQuestion, setNewQuestion] = useState({
        questionText: '',
        options: ['', '', '', ''],
        correctAnswer: 0
    });

    const fetchQuizData = async () => {
        try {
            const res = await api.get(`/instructor/courses/${courseId}/quiz`);
            if (res.data) {
                const quizData = res.data;
                quizData.Questions = quizData.Questions.map(q => ({
                    ...q,
                    options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options
                }));
                setQuiz(quizData);
                
                const attemptsRes = await api.get(`/instructor/quizzes/${res.data.id}/attempts`);
                setAttempts(attemptsRes.data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQuizData();
    }, [courseId]);

    const handleUpdateQuizSettings = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await api.post(`/instructor/courses/${courseId}/quiz`, {
                title: quiz.title,
                timeLimit: quiz.timeLimit,
                passPercentage: quiz.passPercentage
            });
            alert('Quiz settings updated');
            fetchQuizData();
        } catch (err) {
            alert('Failed to update quiz settings');
        } finally {
            setSaving(false);
        }
    };

    const handleAddQuestion = async (e) => {
        e.preventDefault();
        if (!quiz.id) {
            alert('Please save quiz settings first');
            return;
        }
        try {
            await api.post(`/instructor/quizzes/${quiz.id}/questions`, newQuestion);
            setShowQuestionForm(false);
            setNewQuestion({ questionText: '', options: ['', '', '', ''], correctAnswer: 0 });
            fetchQuizData();
        } catch (err) {
            alert('Failed to add question');
        }
    };

    const handleDeleteQuestion = async (id) => {
        if (!window.confirm('Delete this question?')) return;
        try {
            await api.delete(`/instructor/questions/${id}`);
            fetchQuizData();
        } catch (err) {
            alert('Delete failed');
        }
    };

    return (
        <DashboardLayout>
            <div className="page-header flex-between">
                <div>
                    <h1>Quiz Management</h1>
                    <p>Configure assessment and view student performance.</p>
                </div>
            </div>

            <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
                <form onSubmit={handleUpdateQuizSettings}>
                    <div className="grid-3" style={{ gap: '1.5rem' }}>
                        <div className="form-group">
                            <label className="form-label"><List size={16} /> Quiz Title</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                value={quiz.title}
                                onChange={(e) => setQuiz({...quiz, title: e.target.value})}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label"><Clock size={16} /> Time Limit (mins)</label>
                            <input 
                                type="number" 
                                className="form-control" 
                                value={quiz.timeLimit}
                                onChange={(e) => setQuiz({...quiz, timeLimit: parseInt(e.target.value)})}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label"><Award size={16} /> Pass %</label>
                            <input 
                                type="number" 
                                className="form-control" 
                                value={quiz.passPercentage}
                                onChange={(e) => setQuiz({...quiz, passPercentage: parseInt(e.target.value)})}
                                required
                            />
                        </div>
                    </div>
                    <button type="submit" className="btn-primary" style={{ marginTop: '1rem' }} disabled={saving}>
                        <Save size={18} style={{ marginRight: '0.5rem' }} /> {saving ? 'Saving...' : 'Update Quiz Settings'}
                    </button>
                </form>
            </div>

            <div className="tabs" style={{ display: 'flex', gap: '2rem', borderBottom: '2px solid var(--border)', marginBottom: '2rem' }}>
                <button 
                    onClick={() => setActiveTab('questions')}
                    style={{ 
                        padding: '1rem', 
                        fontWeight: '700', 
                        color: activeTab === 'questions' ? 'var(--primary)' : '#64748b',
                        borderBottom: activeTab === 'questions' ? '3px solid var(--primary)' : 'none',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer'
                    }}
                >
                    <HelpCircle size={18} style={{ marginRight: '0.5rem' }} /> Questions ({quiz.Questions.length})
                </button>
                <button 
                    onClick={() => setActiveTab('attempts')}
                    style={{ 
                        padding: '1rem', 
                        fontWeight: '700', 
                        color: activeTab === 'attempts' ? 'var(--primary)' : '#64748b',
                        borderBottom: activeTab === 'attempts' ? '3px solid var(--primary)' : 'none',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer'
                    }}
                >
                    <Users size={18} style={{ marginRight: '0.5rem' }} /> Student Attempts ({attempts.length})
                </button>
            </div>

            {activeTab === 'questions' ? (
                <div>
                    <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: '700' }}>Quiz Questions</h2>
                        {!showQuestionForm && (
                            <button onClick={() => setShowQuestionForm(true)} className="btn-primary">
                                <Plus size={18} style={{ marginRight: '0.5rem' }} /> Add Question
                            </button>
                        )}
                    </div>

                    {showQuestionForm && (
                        <div className="card" style={{ padding: '2rem', marginBottom: '2rem', border: '1px solid var(--primary)' }}>
                            <form onSubmit={handleAddQuestion}>
                                <div className="form-group">
                                    <label className="form-label">Question Text</label>
                                    <textarea 
                                        className="form-control" 
                                        value={newQuestion.questionText}
                                        onChange={(e) => setNewQuestion({...newQuestion, questionText: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="grid-2" style={{ marginTop: '1rem', gap: '1rem' }}>
                                    {newQuestion.options.map((opt, i) => (
                                        <div key={i} className="form-group">
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                                <input 
                                                    type="radio" 
                                                    name="correct" 
                                                    checked={newQuestion.correctAnswer === i}
                                                    onChange={() => setNewQuestion({...newQuestion, correctAnswer: i})}
                                                />
                                                <label className="form-label">Option {i + 1} {newQuestion.correctAnswer === i && '(Correct)'}</label>
                                            </div>
                                            <input 
                                                type="text" 
                                                className="form-control" 
                                                value={opt}
                                                onChange={(e) => {
                                                    const opts = [...newQuestion.options];
                                                    opts[i] = e.target.value;
                                                    setNewQuestion({...newQuestion, options: opts});
                                                }}
                                                required
                                            />
                                        </div>
                                    ))}
                                </div>
                                <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
                                    <button type="submit" className="btn-primary">Save Question</button>
                                    <button type="button" onClick={() => setShowQuestionForm(false)} className="btn-primary" style={{ background: 'white', color: 'var(--text)', borderColor: 'var(--border)' }}>Cancel</button>
                                </div>
                            </form>
                        </div>
                    )}

                    <div className="question-list">
                        {quiz.Questions.map((q, idx) => (
                            <div key={q.id} className="card" style={{ padding: '1.5rem', marginBottom: '1rem' }}>
                                <div className="flex-between">
                                    <div style={{ fontWeight: '700', fontSize: '1.1rem' }}>Q{idx + 1}: {q.questionText}</div>
                                    <button className="btn-icon" onClick={() => handleDeleteQuestion(q.id)}>
                                        <Trash2 size={18} color="#ef4444" />
                                    </button>
                                </div>
                                <div className="grid-2" style={{ marginTop: '1rem', gap: '0.75rem' }}>
                                    {q.options.map((opt, i) => (
                                        <div key={i} style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: i === q.correctAnswer ? 'rgba(34, 197, 94, 0.1)' : 'transparent', color: i === q.correctAnswer ? '#15803d' : 'inherit', fontWeight: i === q.correctAnswer ? '600' : '400' }}>
                                            {opt} {i === q.correctAnswer && '✓'}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Student</th>
                                <th>Score</th>
                                <th>Result</th>
                                <th>Attempt Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {attempts.map(att => (
                                <tr key={att.id}>
                                    <td>
                                        <div style={{ fontWeight: '600' }}>{att.student?.fullName}</div>
                                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{att.student?.email}</div>
                                    </td>
                                    <td>{att.score}%</td>
                                    <td>
                                        <span className={`status-badge status-${att.status === 'PASS' ? 'approved' : 'rejected'}`}>
                                            {att.status}
                                        </span>
                                    </td>
                                    <td>{new Date(att.createdAt).toLocaleString()}</td>
                                </tr>
                            ))}
                            {attempts.length === 0 && (
                                <tr>
                                    <td colSpan="4" style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>No student attempts found yet.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </DashboardLayout>
    );
};

export default QuizManagement;
