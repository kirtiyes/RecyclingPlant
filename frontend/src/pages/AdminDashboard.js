import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/AdminDashboard.css'; // Import the CSS file

const AdminDashboard = () => {
    return (
        <div className="admin-dashboard-container">
            <h1 className="admin-dashboard-title">Admin Dashboard</h1>
            <div className="admin-dashboard-buttons">
                <Link to="/admin/employees/view" className="admin-dashboard-link">
                    <button className="admin-dashboard-button">Employees</button>
                </Link>
                <Link to="/admin/departments/view" className="admin-dashboard-link">
                    <button className="admin-dashboard-button">Departments</button>
                </Link>
                <Link to="/admin/machines/view" className="admin-dashboard-link">
                    <button className="admin-dashboard-button">Machines</button>
                </Link>
                <Link to="/admin/materials/view" className="admin-dashboard-link">
                    <button className="admin-dashboard-button">Materials</button>
                </Link>
                <Link to="/admin/processes/view" className="admin-dashboard-link">
                    <button className="admin-dashboard-button">Processes</button>
                </Link>
                <Link to="/admin/material_inventory/view" className="admin-dashboard-link">
                    <button className="admin-dashboard-button">Material Inventory</button>
                </Link>
                <Link to="/admin/employee-attendance" className="admin-dashboard-link">
                    <button className="admin-dashboard-button">Employee Attendance</button>
                </Link>
            </div>
        </div>
    );
};

export default AdminDashboard;
