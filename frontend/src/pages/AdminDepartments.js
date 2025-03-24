// src/pages/AdminDepartments.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../styles/AdminDepartments.css';

const AdminDepartments = () => {
    const [departments, setDepartments] = useState([]);

    useEffect(() => {
        // Fetch departments from the server
        axios.get('http://localhost:5000/api/departments')
            .then(response => setDepartments(response.data))
            .catch(error => console.error('Error fetching departments:', error));
    }, []);

    const handleRemoveDepartment = (departmentId) => {
        // Logic to remove department
        if (window.confirm("Are you sure you want to remove this department?")) {
            axios.delete(`http://localhost:5000/api/departments/${departmentId}`)
                .then(() => {
                    setDepartments(departments.filter(dept => dept.Department_ID !== departmentId));
                })
                .catch(error => console.error('Error removing department:', error));
        }
    };

    return (
        <div className="admin-departments-wrapper">
        <div className="admin-departments-container" style={{ textAlign: 'center', marginTop: '50px' }}>
            <h2>Manage Departments</h2>
            <div style={{ marginTop: '20px' }}>
                <Link to="/admin/departments/add">
                    <button style={{ padding: '10px 20px', marginBottom: '20px' }}>Add Department</button>
                </Link>
                <table style={{ margin: '0 auto', border: '1px solid black', padding: '10px' }}>
                    <thead>
                        <tr>
                            <th>Department ID</th>
                            <th>Name</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {departments.map((department) => (
                            <tr key={department.Department_ID}>
                                <td>{department.Department_ID}</td>
                                <td>{department.Department_Name}</td>
                                <td>
                                    <button
                                    onClick={() => {
                                        const confirmDelete = window.confirm('Are you sure you want to delete this employee?');
                                            if (confirmDelete) {
                                                handleRemoveDepartment(department.Department_ID);
                                            }           
                                        }}
                                    >
                                        Remove
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
        </div>
    );
};

export default AdminDepartments;
