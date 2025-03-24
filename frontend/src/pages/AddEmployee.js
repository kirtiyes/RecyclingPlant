import React, { useState } from 'react';
import axios from 'axios';
import '../styles/AdminAddEmployee.css'; // Import your CSS file

const AddEmployee = () => {
    const [employeeData, setEmployeeData] = useState({
        Employee_ID: '',
        Employee_Name: '',
        Employee_Role: '',
        Salary: '',
        Department_ID: '',
        Date_of_Joining: '',
        Contact_Details: '',
        Address: '',
        Status: 'Active', // Default value
        Last_Paid_Date: '',
        Salary_Updated_On: '',
        Password: ''
    });
    const [message, setMessage] = useState(''); // Store error or success message

    const handleChange = (e) => {
        setEmployeeData({
            ...employeeData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setMessage('');
        axios.post('http://localhost:5000/api/employees', employeeData)
            .then(response => {
                console.log('Employee added:', response.data);
                setMessage('Employee added successfully!');
                // Clear form
                setEmployeeData({
                    Employee_ID: '',
                    Employee_Name: '',
                    Employee_Role: '',
                    Salary: '',
                    Department_ID: '',
                    Date_of_Joining: '',
                    Contact_Details: '',
                    Address: '',
                    Status: 'Active',
                    Last_Paid_Date: '',
                    Salary_Updated_On: '',
                    Password: ''
                });
            })
            .catch(error => {
                console.error('There was an error adding the employee:', error);
                setMessage('There was an error adding the employee.'); // Error message
            });
    };

    return (
        <div className="add-employee-wrapper">
            <div className="add-employee-container">
                <h2>Add a New Employee</h2>
                <form onSubmit={handleSubmit}>
                    <table>
                        <tbody>
                            <tr>
                                <td><label>Employee ID:</label></td>
                                <td>
                                    <input
                                        type="text"
                                        name="Employee_ID"
                                        value={employeeData.Employee_ID}
                                        onChange={handleChange}
                                        required
                                        placeholder="Employee ID"
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td><label>Employee Name:</label></td>
                                <td>
                                    <input
                                        type="text"
                                        name="Employee_Name"
                                        value={employeeData.Employee_Name}
                                        onChange={handleChange}
                                        required
                                        placeholder="Employee Name"
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td><label>Employee Role:</label></td>
                                <td>
                                    <input
                                        type="text"
                                        name="Employee_Role"
                                        value={employeeData.Employee_Role}
                                        onChange={handleChange}
                                        required
                                        placeholder="Employee Role"
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td><label>Salary:</label></td>
                                <td>
                                    <input
                                        type="number"
                                        name="Salary"
                                        value={employeeData.Salary}
                                        onChange={handleChange}
                                        required
                                        placeholder="Salary"
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td><label>Department ID:</label></td>
                                <td>
                                    <input
                                        type="text"
                                        name="Department_ID"
                                        value={employeeData.Department_ID}
                                        onChange={handleChange}
                                        placeholder="Department ID"
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td><label>Date of Joining:</label></td>
                                <td>
                                    <input
                                        type="date"
                                        name="Date_of_Joining"
                                        value={employeeData.Date_of_Joining}
                                        onChange={handleChange}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td><label>Contact Details:</label></td>
                                <td>
                                    <input
                                        type="text"
                                        name="Contact_Details"
                                        value={employeeData.Contact_Details}
                                        onChange={handleChange}
                                        placeholder="Contact Details"
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td><label>Address:</label></td>
                                <td>
                                    <input
                                        type="text"
                                        name="Address"
                                        value={employeeData.Address}
                                        onChange={handleChange}
                                        placeholder="Address"
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td><label>Last Paid Date:</label></td>
                                <td>
                                    <input
                                        type="date"
                                        name="Last_Paid_Date"
                                        value={employeeData.Last_Paid_Date}
                                        onChange={handleChange}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td><label>Salary Updated On:</label></td>
                                <td>
                                    <input
                                        type="date"
                                        name="Salary_Updated_On"
                                        value={employeeData.Salary_Updated_On}
                                        onChange={handleChange}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td><label>Password:</label></td>
                                <td>
                                    <input
                                        type="password"
                                        name="Password"
                                        value={employeeData.Password}
                                        onChange={handleChange}
                                        required
                                        placeholder="Password"
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <br />
                    <button type="submit">Add Employee</button>
                </form>
                {message && <p>{message}</p>}
            </div>
        </div>
    );
};

export default AddEmployee;
