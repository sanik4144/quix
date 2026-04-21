import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import api from '../../services/api';
import { ArrowLeft, Mail, User } from 'lucide-react';

const EnrolledStudents = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const res = await api.get(`/instructor/courses/${courseId}/students`);
                setEnrollments(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchStudents();
    }, [courseId]);

    return (
        <DashboardLayout>
            <div className="page-header flex-between">
                <div>
                    <button onClick={() => navigate(-1)} className="btn-icon" style={{ marginBottom: '1rem' }}>
                        <ArrowLeft size={20} />
                    </button>
                    <h1>Enrolled Students</h1>
                    <p>View and manage students enrolled in this course.</p>
                </div>
            </div>

            <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Student Name</th>
                            <th>Email Address</th>
                            <th>Enrollment Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {enrollments.length > 0 ? (
                            enrollments.map((env) => (
                                <tr key={env.id}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <User size={16} color="#64748b" />
                                            </div>
                                            <span style={{ fontWeight: '600' }}>{env.student?.fullName}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <Mail size={14} color="#64748b" />
                                            {env.student?.email}
                                        </div>
                                    </td>
                                    <td>{new Date(env.createdAt).toLocaleDateString()}</td>
                                    <td>
                                        <button className="btn-icon" title="Email Student">
                                            <Mail size={16} color="var(--primary)" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                                    {loading ? 'Loading students...' : 'No students enrolled yet.'}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </DashboardLayout>
    );
};

export default EnrolledStudents;
