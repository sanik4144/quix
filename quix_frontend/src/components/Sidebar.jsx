import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    LayoutDashboard,
    Users,
    BookOpen,
    LogOut,
    Layers,
    ChevronRight
} from 'lucide-react';

const Sidebar = () => {
    const { user, logout } = useAuth();
    const role = user?.role;

    const navItems = {
        'Super Admin': [
            { path: '/admin', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
            { path: '/admin/users', label: 'Users', icon: <Users size={20} /> },
            { path: '/admin/courses', label: 'Courses', icon: <BookOpen size={20} /> },
        ],
        'Admin': [
            { path: '/admin', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
            { path: '/admin/users', label: 'Users', icon: <Users size={20} /> },
            { path: '/admin/courses', label: 'Courses', icon: <BookOpen size={20} /> },
        ],
        'Instructor': [
            { path: '/instructor', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
            { path: '/instructor/my-courses', label: 'My Courses', icon: <BookOpen size={20} /> },
        ],
        'Student': [
            { path: '/student', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
            { path: '/student/browse', label: 'Browse Courses', icon: <BookOpen size={20} /> },
            { path: '/student/my-learning', label: 'My Learning', icon: <Layers size={20} /> },
        ]
    };

    const currentNav = navItems[role] || [];

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <div className="sidebar-logo">Q</div>
                <h2>Quix</h2>
            </div>

            <nav className="sidebar-nav">
                {currentNav.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
                        end
                    >
                        {item.icon}
                        <span>{item.label}</span>
                        <ChevronRight className="arrow" size={16} />
                    </NavLink>
                ))}
            </nav>

            <div className="sidebar-footer">
                <div className="user-info">
                    <div className="user-avatar">{user?.fullName?.charAt(0)}</div>
                    <div className="user-details">
                        <p className="user-name">{user?.fullName}</p>
                        <p className="user-role">{role}</p>
                    </div>
                </div>
                <button onClick={logout} className="logout-btn">
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
