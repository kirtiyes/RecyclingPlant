import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/ManMainDash.css'

const AdminDashboard = () => {
    return (
        <div className='manmain-dashboard-container' style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1 className='manmain-dashboard-title'>Manager Maintenance Dashboard</h1>
            <div className='manmain-dashboard-buttons' style={{ marginTop: '20px' }}>
                <Link to="/managermaintenance/employees/view">
                    <button className='manmain-dashboard-button' style={{ padding: '10px 20px', marginBottom: '10px' }}>Employees</button>
                </Link>
                <Link to="/managermaintenance/departments">
                    <button className='manmain-dashboard-button' style={{ padding: '10px 20px', marginBottom: '10px' }}>Departments</button>
                </Link>
                <Link to="/managermaintenance/machines/view">
                    <button className='manmain-dashboard-button' style={{ padding: '10px 20px', marginBottom: '10px' }}>Machines</button>
                </Link>
                <Link to="/managermaintenance/materials">
                    <button className='manmain-dashboard-button' style={{ padding: '10px 20px', marginBottom: '10px' }}>Materials</button>
                </Link>
                <Link to="/managermaintenance/processes">
                    <button className='manmain-dashboard-button' style={{ padding: '10px 20px', marginBottom: '10px' }}>Processes</button>
                </Link>
                <Link to="/managermaintenance/material_inventory/view">
                    <button className='manmain-dashboard-button' style={{ padding: '10px 20px', marginBottom: '10px' }}>Material Inventory</button>
                </Link>
                <Link to="/managermaintenance/employee_attendance/view">
                    <button className='manmain-dashboard-button' style={{ padding: '10px 20px', marginBottom: '10px' }}>Employee Attendance</button>
                </Link>
            </div>
        </div>
    );
};

export default AdminDashboard;
