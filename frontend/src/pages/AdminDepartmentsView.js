// src/pages/AdminDepartmentsView.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Import Link
import '../styles/AdminDepartments.css';

const AdminDepartmentsView = () => {
    const [departments, setDepartments] = useState([]);

    useEffect(() => {
        // Fetch departments from the server
        axios.get('http://localhost:5000/api/departments')
            .then(response => setDepartments(response.data))
            .catch(error => console.error('Error fetching departments:', error));
    }, []);

    const handleRemoveDepartment = (departmentId) => {
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
            <h2 className="admin-departments-title">Manage Departments</h2>
            <Link to="/admin/departments/add">
                <button className="admin-departments-add-button" style={{ padding: '10px 20px', marginBottom: '20px' }}>Add Department</button>
            </Link>
            <table className='admin-departments-table' style={{ margin: '0 auto', border: '1px solid black', padding: '10px' }}>
                <thead>
                    <tr>
                        <th>Department ID</th>
                        <th>Name</th>
                        <th>Department Head ID</th>
                        <th>No. of Employees</th>
                        <th>Room ID</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {departments.map((department) => (
                        <tr key={department.Department_ID}>
                            <td>{department.Department_ID}</td>
                            <td>{department.Department_Name}</td>
                            <td>{department.Department_HeadID}</td>
                            <td>{department.No_of_Employees}</td>
                            <td>{department.Room_ID}</td>
                            <td>
                                <button className="admin-departments-remove-button" onClick={() => handleRemoveDepartment(department.Department_ID)}>
                                    Remove
                                </button>
                                <Link to={`/admin/departments/edit/${department.Department_ID}`}>
                                    <button className='admindept-button2' style={{ marginLeft: '10px' }}>
                                        Edit
                                    </button>
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        </div>
    );
};

export default AdminDepartmentsView;
