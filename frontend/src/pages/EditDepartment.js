import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/EditDepartment.css'

const EditDepartment = () => {
    const { id } = useParams(); // Get the department ID from the URL parameters
    const navigate = useNavigate(); // For navigation after saving
    const [department, setDepartment] = useState({
        Department_ID: '',
        Department_Name: '',
        Department_HeadID: '',
        No_of_Employees: '',
        Room_ID: ''
    });

    const [message, setMessage] = useState(''); // Add message state for feedback

    useEffect(() => {
        // Fetch the department data to populate the form
        const fetchDepartment = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/departments/${id}`);
                setDepartment(response.data); // Assuming the API returns the department object directly
            } catch (error) {
                console.error('Error fetching department data:', error);
                setMessage('Error fetching department data.');
            }
        };

        fetchDepartment();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDepartment(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Send updated department data to the server
            const response = await axios.put(`http://localhost:5000/api/departments/${id}`, department);
            setMessage('Department updated successfully!'); // Set success message
            // Optionally navigate to another page after saving
            // navigate('/admin/departments/view');
        } catch (error) {
            console.error('Error updating department:', error);
            setMessage('Error updating department: ' + (error.response?.data?.message || error.message)); // Set error message
        }
    };

    return (
        <div className="edit-department-wrapper">
        <div className="edit-department-container" style={{ textAlign: 'center', marginTop: '50px' }}>
            <h2>Edit Department</h2>
            <form onSubmit={handleSubmit}>
                <table style={{ margin: '0 auto' }}>
                    <tbody>
                        <tr>
                            <td><label>Department ID:</label></td>
                            <td>
                                <input
                                    type="text"
                                    name="Department_ID"
                                    value={department.Department_ID}
                                    onChange={handleChange}
                                    placeholder="Department ID"
                                    disabled
                                />
                            </td>
                        </tr>
                        <tr>
                            <td><label>Department Name:</label></td>
                            <td>
                                <input
                                    type="text"
                                    name="Department_Name"
                                    value={department.Department_Name}
                                    onChange={handleChange}
                                    placeholder="Department Name"
                                    required
                                />
                            </td>
                        </tr>
                        <tr>
                            <td><label>Department Head ID:</label></td>
                            <td>
                                <input
                                    type="text"
                                    name="Department_HeadID"
                                    value={department.Department_HeadID}
                                    onChange={handleChange}
                                    placeholder="Department Head ID"
                                    required
                                />
                            </td>
                        </tr>
                        <tr>
                            <td><label>Number of Employees:</label></td>
                            <td>
                                <input
                                    type="number"
                                    name="No_of_Employees"
                                    value={department.No_of_Employees}
                                    onChange={handleChange}
                                    placeholder="Number of Employees"
                                    required
                                />
                            </td>
                        </tr>
                        <tr>
                            <td><label>Room ID:</label></td>
                            <td>
                                <input
                                    type="text"
                                    name="Room_ID"
                                    value={department.Room_ID}
                                    onChange={handleChange}
                                    placeholder="Room ID"
                                    required
                                />
                            </td>
                        </tr>
                        <tr>
                            <td colSpan="2">
                                <button type="submit">Save Changes</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </form>
            {message && <p className="message">{message}</p>} {/* Display message if there is one */}
        </div>
        </div>
    );
};

export default EditDepartment;
