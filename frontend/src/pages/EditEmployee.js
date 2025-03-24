import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/AdminEditEmployee.css'

const EditEmployee = () => {
    const { id } = useParams(); // Get the employee ID from the URL parameters
    const navigate = useNavigate(); // For navigation after saving
    const [employee, setEmployee] = useState({
        Employee_ID: '',
        Employee_Name: '',
        Employee_Role: '',
        Salary: '',
        Department_ID: '',
        Date_of_Joining: '',
        Contact_Details: '',
        Address: '',
        Last_Paid_Date: '',
        Salary_Updated_On: ''
    });

    const [message, setMessage] = useState(''); // State to store success or error message

    useEffect(() => {
        // Fetch the employee data to populate the form
        const fetchEmployee = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/employees/${id}`);
                setEmployee(response.data); // Assuming the API returns the employee object directly
            } catch (error) {
                console.error('Error fetching employee data:', error);
            }
        };

        fetchEmployee();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEmployee(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Ensure the dates are handled correctly
        const formattedEmployee = {
            ...employee,
            Date_of_Joining: employee.Date_of_Joining ? new Date(employee.Date_of_Joining).toISOString().split('T')[0] : null,
            Last_Paid_Date: employee.Last_Paid_Date ? new Date(employee.Last_Paid_Date).toISOString().split('T')[0] : null,
            Salary_Updated_On: employee.Salary_Updated_On ? new Date(employee.Salary_Updated_On).toISOString().split('T')[0] : null
        };

        try {
            // Send updated employee data to the server
            const response = await axios.put(`http://localhost:5000/api/employees/${id}?role=Admin`, formattedEmployee);
            setMessage('Employee updated successfully!'); // Set success message

            // Optionally navigate to another page after a successful update
        } catch (error) {
            console.error('Error updating employee:', error);
            setMessage('Error updating employee: ' + (error.response?.data?.message || error.message)); // Set error message
        }
    };

    return (
        <div className="edit-employee-wrapper">
        <div className="edit-employee-container" style={{ textAlign: 'center', marginTop: '50px' }}>
            <h2>Edit Employee</h2>
            <form onSubmit={handleSubmit}>
                <table style={{ margin: '0 auto' }}>
                    <tbody>
                        <tr>
                            <td><label>Employee ID:</label></td>
                            <td>
                                <input
                                    type="text"
                                    name="Employee_ID"
                                    value={employee.Employee_ID}
                                    onChange={handleChange}
                                    placeholder="Employee ID"
                                    disabled
                                />
                            </td>
                        </tr>
                        <tr>
                            <td><label>Employee Name:</label></td>
                            <td>
                                <input
                                    type="text"
                                    name="Employee_Name"
                                    value={employee.Employee_Name}
                                    onChange={handleChange}
                                    placeholder="Employee Name"
                                    required
                                />
                            </td>
                        </tr>
                        <tr>
                            <td><label>Employee Role:</label></td>
                            <td>
                                <input
                                    type="text"
                                    name="Employee_Role"
                                    value={employee.Employee_Role}
                                    onChange={handleChange}
                                    placeholder="Employee Role"
                                    required
                                />
                            </td>
                        </tr>
                        <tr>
                            <td><label>Salary:</label></td>
                            <td>
                                <input
                                    type="number"
                                    name="Salary"
                                    value={employee.Salary}
                                    onChange={handleChange}
                                    placeholder="Salary"
                                    required
                                />
                            </td>
                        </tr>
                        <tr>
                            <td><label>Department ID:</label></td>
                            <td>
                                <input
                                    type="text"
                                    name="Department_ID"
                                    value={employee.Department_ID}
                                    onChange={handleChange}
                                    placeholder="Department ID"
                                    required
                                />
                            </td>
                        </tr>
                        <tr>
                            <td><label>Date of Joining:</label></td>
                            <td>
                                <input
                                    type="date"
                                    name="Date_of_Joining"
                                    value={employee.Date_of_Joining ? new Date(employee.Date_of_Joining).toISOString().split('T')[0] : ''}
                                    onChange={handleChange}
                                    required
                                />
                            </td>
                        </tr>
                        <tr>
                            <td><label>Contact Details:</label></td>
                            <td>
                                <input
                                    type="text"
                                    name="Contact_Details"
                                    value={employee.Contact_Details}
                                    onChange={handleChange}
                                    placeholder="Contact Details"
                                    required
                                />
                            </td>
                        </tr>
                        <tr>
                            <td><label>Address:</label></td>
                            <td>
                                <input
                                    type="text"
                                    name="Address"
                                    value={employee.Address}
                                    onChange={handleChange}
                                    placeholder="Address"
                                    required
                                />
                            </td>
                        </tr>
                        <tr>
                            <td><label>Last Paid Date:</label></td>
                            <td>
                                <input
                                    type="date"
                                    name="Last_Paid_Date"
                                    value={employee.Last_Paid_Date ? new Date(employee.Last_Paid_Date).toISOString().split('T')[0] : ''}
                                    onChange={handleChange}
                                    required
                                />
                            </td>
                        </tr>
                        <tr>
                            <td><label>Salary Updated On:</label></td>
                            <td>
                                <input
                                    type="date"
                                    name="Salary_Updated_On"
                                    value={employee.Salary_Updated_On ? new Date(employee.Salary_Updated_On).toISOString().split('T')[0] : ''}
                                    onChange={handleChange}
                                    required
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>

                <button type="submit" style={{ marginTop: '20px' }}>Save Changes</button>
            </form>

            {message && <p>{message}</p>} {/* Conditionally display the message */}
        </div>
        </div>
    );
};

export default EditEmployee;
