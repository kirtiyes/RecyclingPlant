import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/EmpDash.css'

const EmployeeOperationsDashboard = () => {
    return (
        <div className='emp-dashboard-container' style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1 className='emp-dashboard-title'>Employee Operations Dashboard</h1>
            <div className='emp-dashboard-buttons' style={{ marginTop: '20px' }}>
                <Link to="/employeeoperations/departments">
                    <button className='emp-dashboard-button' style={{ padding: '10px 20px', marginBottom: '10px' }}>Departments</button>
                </Link>
                <Link to="/employeeoperations/machines/view">
                    <button className='emp-dashboard-button' style={{ padding: '10px 20px', marginBottom: '10px' }}>Machines</button>
                </Link>
                <Link to="/employeeoperations/materials/view">
                    <button className='emp-dashboard-button' style={{ padding: '10px 20px', marginBottom: '10px' }}>Materials</button>
                </Link>
                <Link to="/employeeoperations/processes/view">
                    <button className='emp-dashboard-button' style={{ padding: '10px 20px', marginBottom: '10px' }}>Processes</button>
                </Link>
                <Link to="/employeeoperations/material_inventory/view">
                    <button className='emp-dashboard-button' style={{ padding: '10px 20px', marginBottom: '10px' }}>Material Inventory</button>
                </Link>
            </div>
        </div>
    );
};

export default EmployeeOperationsDashboard;
