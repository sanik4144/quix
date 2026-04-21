import React from 'react';
import Sidebar from '../components/Sidebar';

const DashboardLayout = ({ children }) => {
    return (
        <div className="dashboard-layout">
            <Sidebar />
            <main className="dashboard-content">
                <div className="content-container">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
