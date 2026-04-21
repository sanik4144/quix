import { React, useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import api from '../../services/api';
import { Check, X, Trash } from 'lucide-react';

const AdminCourseManagement = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchCourses = async () => {
        try {
            const res = await api.get('/admin/courses');
            setCourses(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchCourses();
    }, []);

    const handleStatusUpdate = async (id, status) => {
        try {
            await api.patch(`/admin/courses/${id}/status`, { status });
            fetchCourses();
        } catch (error) {
            alert(error.response?.data?.message || 'Update failed');
        }
    }

    const deleteCourse = async (id) => {
        try {
            await api.delete(`/admin/courses/${id}/delete`);
            fetchCourses();
        } catch (error) {
            alert(error.response?.data?.message || "Deletion Failed");
        }
    }


    return (
        <DashboardLayout>
            <div className='page-header'>
                <h1>Admin Course Management</h1>
                <p>This is admin course management page</p>
            </div>

            <div className='table-container'>
                <table>
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Description</th>
                            <th>Category</th>
                            {/* <th>Thumbnail</th> */}
                            <th>Instructor</th>
                            <th>Difficulty</th>
                            <th>Price</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            courses.map((course) => (
                                <tr key={course.id}>
                                    <td style={{ fontWeight: '600' }}>{course.title}</td>
                                    <td style={{ maxWidth: '250px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{course.description}</td>
                                    <td>{course.category}</td>
                                    <td>{course.instructor.fullName}</td>
                                    <td>
                                        <span className={`status-badge status-${course.difficulty.toLowerCase()}`}>
                                            {course.difficulty}
                                        </span>
                                    </td>
                                    <td style={{ fontWeight: '600' }}>${course.pricing}</td>
                                    <td>
                                        <span className={`status-badge status-${course.status.toLowerCase()}`}>
                                            {course.status}
                                        </span>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            {course.status === 'PENDING' && (
                                                <>
                                                    <button
                                                        onClick={() => handleStatusUpdate(course.id, 'APPROVED')}
                                                        className="btn-icon"
                                                        title='Publish'
                                                    >
                                                        <Check size={20} color="#22c55e" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatusUpdate(course.id, 'REJECTED')}
                                                        className='btn-icon'
                                                        title='Reject'
                                                    >
                                                        <X size={20} color="#ef4444" />
                                                    </button>
                                                </>
                                            )}
                                            {course.status === 'APPROVED' && (
                                                <button
                                                    onClick={() => handleStatusUpdate(course.id, 'DRAFT')}
                                                    className='btn-icon'
                                                    title='Unpublish (Draft)'
                                                >
                                                    <X size={20} color="#f59e0b" />
                                                </button>
                                            )}
                                            {course.status === 'REJECTED' && (
                                                <>
                                                    <button
                                                        onClick={() => handleStatusUpdate(course.id, 'APPROVED')}
                                                        className="btn-icon"
                                                        title='Publish'
                                                    >
                                                        <Check size={20} color="#22c55e" />
                                                    </button>
                                                    <button
                                                        onClick={() => deleteCourse(course.id)}
                                                        className="btn-icon"
                                                        title='Delete'
                                                    >
                                                        <Trash size={20} color="#ef4444" />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </DashboardLayout>
    );
};

export default AdminCourseManagement;