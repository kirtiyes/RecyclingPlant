import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../styles/AdminEmployees.css'

const AdminEmployees = () => {
    const [employees, setEmployees] = useState([]);

    useEffect(() => {
        // Fetch employees from the server
        axios.get('http://localhost:5000/api/employees')
            .then(response => setEmployees(response.data))
            .catch(error => console.error('Error fetching employees:', error));
    }, []);

    const handleRemoveEmployee = (employeeId) => {
        axios.delete(`http://localhost:5000/api/employees/${employeeId}`)
            .then(() => {
                setEmployees(employees.filter(emp => emp.Employee_ID !== employeeId));
            })
            .catch(error => console.error('Error removing employee:', error));
    };

    return (
        <div className="admin-employee-container">
            <h2 className="admin-employee-title">Manage Employees</h2>
            
            <div style={{ marginTop: '20px' }}>
                <Link to="/admin/employees/add" className="admin-employee-link">
                    <button className="admin-employee-add-button">Add Employee</button>
                </Link>
                <table className="admin-employee-table">
                    <thead>
                        <tr>
                            <th>Employee ID</th>
                            <th>Name</th>
                            <th>Role</th>
                            <th>Salary</th>
                            <th>Department ID</th>
                            <th>Date of Joining</th>
                            <th>Contact Details</th>
                            <th>Address</th>
                            <th>Last Paid Date</th>
                            <th>Salary Updated On</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {employees.map((employee) => (
                            <tr key={employee.Employee_ID}>
                                <td>{employee.Employee_ID}</td>
                                <td>{employee.Employee_Name}</td>
                                <td>{employee.Employee_Role}</td>
                                <td>{employee.Salary}</td>
                                <td>{employee.Department_ID}</td>
                                <td>{new Date(employee.Date_of_Joining).toLocaleDateString()}</td>
                                <td>{employee.Contact_Details}</td>
                                <td>{employee.Address}</td>
                                <td>{employee.Last_Paid_Date ? new Date(employee.Last_Paid_Date).toLocaleDateString() : 'N/A'}</td>
                                <td>{employee.Salary_Updated_On ? new Date(employee.Salary_Updated_On).toLocaleDateString() : 'N/A'}</td>
                                <td>
                                    <button
                                        className="admin-employee-action-button admin-employee-remove-button"
                                        onClick={() => {
                                            const confirmDelete = window.confirm('Are you sure you want to delete this employee?');
                                            if (confirmDelete) {
                                                handleRemoveEmployee(employee.Employee_ID);
                                            }
                                        }}
                                    >
                                        Remove
                                    </button>
                                    <Link to={`/admin/employees/edit/${employee.Employee_ID}`} className="admin-employee-link">
                                        <button className="admin-employee-action-button admin-employee-edit-button">
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

export default AdminEmployees;
