import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import api from '../../services/api';
import { Award, Calendar } from 'lucide-react';

const StudentQuizAttempts = () => {
    const { courseId, studentId } = useParams();
    const [attempts, setAttempts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAttempts = async () => {
            try {
                const res = await api.get(`/instructor/courses/${courseId}/students/${studentId}/attempts`);
                setAttempts(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchAttempts();
    }, [courseId, studentId]);

    return (
        <DashboardLayout>
            <div className="page-header flex-between">
                <div>
                    <h1>Student Quiz Attempts</h1>
                    <p>View detailed results of quiz attempts for this student.</p>
                </div>
            </div>

            <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Quiz Title</th>
                            <th>Score</th>
                            <th>Status</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {attempts.length > 0 ? (
                            attempts.map((attempt) => (
                                <tr key={attempt.id}>
                                    <td>
                                        <div style={{ fontWeight: '600' }}>{attempt.Quiz?.title}</div>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <Award size={14} color="#64748b" />
                                            {attempt.score}%
                                        </div>
                                    </td>
                                    <td>
                                        <span style={{ alignItems: 'center', gap: '0.5rem' }} className={`status-badge status-${attempt.status === 'PASS' ? 'approved' : 'rejected'}`}>
                                            {attempt.status}
                                        </span>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <Calendar size={14} color="#64748b" />
                                            {new Date(attempt.createdAt).toLocaleString()}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                                    {loading ? 'Loading attempts...' : 'No quiz attempts recorded for this student.'}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </DashboardLayout>
    );
};

export default StudentQuizAttempts;
