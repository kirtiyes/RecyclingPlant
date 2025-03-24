import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../styles/ManMainEmp.css'

const ManagerMaintenanceViewEmp = ({ userRole }) => { // Accept userRole as a prop
    const [employees, setEmployees] = useState([]);

    useEffect(() => {
        // Fetch employees based on the user role
        axios.get(`http://localhost:5000/api/employees?role=${userRole}`) // Pass role as a query parameter
            .then(response => setEmployees(response.data))
            .catch(error => console.error('Error fetching employees:', error));
    }, [userRole]); // Refetch employees if the role changes

    return (
        <div className='view-manmainemp-wrapper'>
        <div className='view-manmainemp-container' style={{ textAlign: 'center', marginTop: '50px' }}>
            <h2 className='view-manmainemp-title'>Manage Employees</h2>

            <div style={{ marginTop: '20px' }}>
                <table className='view-manmainemp-table' style={{ margin: '0 auto', border: '1px solid black', padding: '10px' }}>
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
                                <td>
                                    {employee.Last_Paid_Date ? new Date(employee.Last_Paid_Date).toLocaleDateString() : 'N/A'}
                                </td>
                                <td>
                                    {employee.Salary_Updated_On ? new Date(employee.Salary_Updated_On).toLocaleDateString() : 'N/A'}
                                </td>
                                <td>
                                    <Link to={`/managermaintenance/employees/edit/${employee.Employee_ID}`}>
                                        <button className='view-manmainemp-edit-button' style={{ marginLeft: '10px' }}>
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
        </div>
    );
};

export default ManagerMaintenanceViewEmp;
