import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import api from '../../services/api';
import { Check, X, UserMinus, Search, Edit2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const UserManagement = () => {
    const [page, setPage] = useState(1);
    const [limit] = useState(5);
    const [totalPages, setTotalPages] = useState(1);

    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [search, setSearch] = useState('');
    const [filters, setFilters] = useState({
        roleId: '',
        status: '',
    });
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [remarksMap, setRemarksMap] = useState({});
    const { user: currentUser } = useAuth();
    const navigate = useNavigate();

    const fetchUsers = async () => {
        try {
            const res = await api.get(`/admin/users?page=${page}&limit=${limit}`);

            setUsers(res.data.users);
            setFilteredUsers(res.data.users);
            setTotalPages(res.data.totalPages);
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
    }, [page]);

    useEffect(() => {
        const initial = {};
        users.forEach(user => {
            initial[user.id] = user.remarks || "";
        });
        setRemarksMap(initial);
    }, [users]);


    useEffect(() => {
            let result = users.filter(c => 
                c.fullName.toLowerCase().includes(search.toLowerCase()) ||
                c.email.toLowerCase().includes(search.toLowerCase())
            );
    
            if (filters.roleId) {
                result = result.filter(c => c.Role?.id === filters.roleId);
            }
            if (filters.status) result = result.filter(c => c.status === filters.status);
    
            setFilteredUsers(result);
        }, [search, filters, users]);


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

            <div className="filter-bar">
                <div className="search-input" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <Search size={18} style={{ position: 'absolute', left: '1rem', color: 'var(--text-muted)' }} />
                    <input 
                        type="text" 
                        placeholder="Search user by name or email..." 
                        style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.8rem', border: '1.5px solid var(--border)', borderRadius: '0.75rem' }}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                
                <select
                    className="filter-select"
                    value={filters.roleId}
                    onChange={(e) => setFilters({ ...filters, roleId: e.target.value })}
                >
                    <option value="">All Roles</option>

                    {roles.map(role => (
                        <option key={role.id} value={role.id}>
                            {role.name}
                        </option>
                    ))}
                </select>

                <select 
                    className="filter-select"
                    value={filters.status}
                    onChange={(e) => setFilters({...filters, status: e.target.value})}
                >
                    <option value="">All Status</option>
                    <option value="APPROVED">Approved</option>
                    <option value="REJECTED">Rejected</option>
                    <option value="SUSPENDED">Suspended</option>
                    <option value="PENDING">Pending</option>
                </select>
            </div>

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th></th>
                            <th>Full Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Remarks</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map((user) => (
                            <tr key={user.id}>
                                <td>
                                    <button 
                                        onClick={()=> navigate(`/admin/users/${user.id}/update`)}
                                        className='custom-blue-btn'>
                                        <Edit2 size={20} />
                                    </button>
                                </td>
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
                                                    className="custom-green-btn"
                                                    title="Approve"
                                                >
                                                    <Check size={22} />
                                                </button>
                                                <button 
                                                    onClick={() => handleStatusUpdate(user.id, 'REJECTED', remarksMap[user.id])}
                                                    className="custom-red-btn"
                                                    title="Reject"
                                                >
                                                    <X size={22} />
                                                </button>
                                            </>
                                        )}
                                        {user.status === 'APPROVED' && user.Role?.name !== 'Super Admin' && (
                                            <button 
                                                onClick={() => handleStatusUpdate(user.id, 'SUSPENDED', remarksMap[user.id])}
                                                className="custom-yellow-btn"
                                                title="Suspend"
                                            >
                                                <UserMinus size={22} />
                                            </button>
                                        )}
                                        {user.status === 'REJECTED' && (
                                            <button 
                                                onClick={() => handleStatusUpdate(user.id, 'APPROVED', remarksMap[user.id])}
                                                className="custom-green-btn"
                                                title="Approve"
                                            >
                                                <Check size={22} />
                                            </button>
                                        )}
                                        {user.status === 'SUSPENDED' && (
                                            <button 
                                                onClick={() => handleStatusUpdate(user.id, 'APPROVED', remarksMap[user.id])}
                                                className="custom-green-btn"
                                                title="Re-activate"
                                            >
                                                <Check size={22} />
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '10px',
                    marginTop: '20px'
                }}>
                    <button
                        disabled={page === 1}
                        onClick={() => setPage(page - 1)}
                        className="pagination-btn"
                    >
                        Prev
                    </button>

                    <span>Page {page} of {totalPages}</span>

                    <button
                        disabled={page === totalPages}
                        onClick={() => setPage(page + 1)}
                        className="pagination-btn"
                    >
                        Next
                    </button>
                </div>
                {users.length === 0 && !loading && (
                    <div>No users found.</div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default UserManagement;
