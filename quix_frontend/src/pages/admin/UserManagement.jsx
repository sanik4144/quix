import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import api from '../../services/api';
import { Check, X, UserMinus, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [remarksMap, setRemarksMap] = useState({});
    const { user: currentUser } = useAuth();

    const fetchUsers = async () => {
        try {
            const res = await api.get('/admin/users');
            setUsers(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchRoles = async () => {
        try {
            const res = await api.get('/admin/roles');
            setRoles(res.data);
        } catch (err) {
            console.error(err);
        }
    };


    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            await Promise.all([fetchUsers(), fetchRoles()]);
            setLoading(false);
        };
        loadData();
    }, []);

    useEffect(() => {
        const initial = {};
        users.forEach(user => {
            initial[user.id] = user.remarks || "";
        });
        setRemarksMap(initial);
    }, [users]);


    const handleStatusUpdate = async (id, status, remarks) => {
        try {
            await api.patch(`/admin/users/${id}/status`, { status, remarks });
            fetchUsers();
        } catch (err) {
            alert(err.response?.data?.message || 'Update failed');
        }
    };

    const handleRoleUpdate = async (userId, roleId) => {
        try {
            await api.patch(`/admin/users/${userId}/role`, { roleId });
            fetchUsers();
            alert('Role updated successfully');
        } catch (err) {
            alert(err.response?.data?.message || 'Role update failed');
        }
    };
    const handleRemarksChange = (userId, value) => {
        setRemarksMap(prev => ({
            ...prev,
            [userId]: value
        }));
    };

    return (
        <DashboardLayout>
            <div className="page-header">
                <h1>User Management</h1>
                <p>Manage users, approve registrations, and assign roles.</p>
            </div>

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Full Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Remarks</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td style={{ fontWeight: '600' }}>{user.fullName}</td>
                                <td>{user.email}</td>
                                <td>
                                    {currentUser?.role === 'Super Admin' ? (
                                        <select 
                                            value={user.roleId} 
                                            onChange={(e) => handleRoleUpdate(user.id, e.target.value)}
                                            className="form-control"
                                            style={{ fontSize: '0.8rem', padding: '0.25rem' }}
                                        >
                                            {roles.map(role => (
                                                <option key={role.id} value={role.id}>{role.name}</option>
                                            ))}
                                        </select>
                                    ) : (
                                        <span className="status-badge" style={{ background: '#f1f5f9', color: '#475569' }}>
                                            {user.Role?.name}
                                        </span>
                                    )}
                                </td>
                                <td>
                                    <span className={`status-badge status-${user.status.toLowerCase()}`}>
                                        {user.status}
                                    </span>
                                </td>
                                <td>
                                    <textarea
                                        value={remarksMap[user.id] || ""}
                                        onChange={(e) => handleRemarksChange(user.id, e.target.value)}
                                        className="form-control"
                                        style={{ minHeight: '40px', fontSize: '0.8rem', padding: '0.4rem' }}
                                        placeholder="Add remarks..."
                                    />
                                </td>
                                <td>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        {user.status === 'PENDING' && (
                                            <>
                                                <button 
                                                    onClick={() => handleStatusUpdate(user.id, 'APPROVED', remarksMap[user.id])}
                                                    className="btn-icon"
                                                    title="Approve"
                                                >
                                                    <Check size={20} color="#22c55e" />
                                                </button>
                                                <button 
                                                    onClick={() => handleStatusUpdate(user.id, 'REJECTED', remarksMap[user.id])}
                                                    className="btn-icon"
                                                    title="Reject"
                                                >
                                                    <X size={20} color="#ef4444" />
                                                </button>
                                            </>
                                        )}
                                        {user.status === 'APPROVED' && user.Role?.name !== 'Super Admin' && (
                                            <button 
                                                onClick={() => handleStatusUpdate(user.id, 'SUSPENDED', remarksMap[user.id])}
                                                className="btn-icon"
                                                title="Suspend"
                                            >
                                                <UserMinus size={20} color="#f59e0b" />
                                            </button>
                                        )}
                                        {user.status === 'REJECTED' && (
                                            <button 
                                                onClick={() => handleStatusUpdate(user.id, 'APPROVED', remarksMap[user.id])}
                                                className="btn-icon"
                                                title="Approve"
                                            >
                                                <Check size={20} color="#22c55e" />
                                            </button>
                                        )}
                                        {user.status === 'SUSPENDED' && (
                                            <button 
                                                onClick={() => handleStatusUpdate(user.id, 'APPROVED', remarksMap[user.id])}
                                                className="btn-icon"
                                                title="Re-activate"
                                            >
                                                <Check size={20} color="#22c55e" />
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {users.length === 0 && !loading && (
                    <div className="p-8 text-center text-muted">No users found.</div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default UserManagement;
