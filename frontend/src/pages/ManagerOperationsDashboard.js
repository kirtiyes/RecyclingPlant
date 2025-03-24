import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/ManOpsDash.css'

const AdminDashboard = () => {
    return (
        <div className='manops-dashboard-container' style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1 className='manops-dashboard-title'>Manager Operations Dashboard</h1>
            <div className='manops-dashboard-buttons' style={{ marginTop: '20px' }}>
                <Link to="/manageroperations/employees/view">
                    <button className='manops-dashboard-button' style={{ padding: '10px 20px', marginBottom: '10px' }}>Employees</button>
                </Link>
                <Link to="/manageroperations/departments">
                    <button className='manops-dashboard-button' style={{ padding: '10px 20px', marginBottom: '10px' }}>Departments</button>
                </Link>
                <Link to="/manageroperations/machines/view">
                    <button className='manops-dashboard-button' style={{ padding: '10px 20px', marginBottom: '10px' }}>Machines</button>
                </Link>
                <Link to="/manageroperations/materials/view">
                    <button className='manops-dashboard-button' style={{ padding: '10px 20px', marginBottom: '10px' }}>Materials</button>
                </Link>
                <Link to="/manageroperations/processes">
                    <button className='manops-dashboard-button' style={{ padding: '10px 20px', marginBottom: '10px' }}>Processes</button>
                </Link>
                <Link to="/manageroperations/material-inventory/view">
                    <button className='manops-dashboard-button' style={{ padding: '10px 20px', marginBottom: '10px' }}>Material Inventory</button>
                </Link>
                <Link to="/manageroperations/employee_attendance/view">
                    <button className='manops-dashboard-button' style={{ padding: '10px 20px', marginBottom: '10px' }}>Employee Attendance</button>
                </Link>
            </div>
        </div>
    );
};

export default AdminDashboard;
