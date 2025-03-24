import React, { useState } from 'react';
import axios from 'axios';
import '../styles/AddDepartment.css'; // Import the CSS file

const AddDepartment = () => {
    const [departmentId, setDepartmentId] = useState('');
    const [departmentName, setDepartmentName] = useState('');
    const [departmentHeadId, setDepartmentHeadId] = useState('');
    const [roomId, setRoomId] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Send the form data to the server
            await axios.post('http://localhost:5000/api/departments', {
                Department_ID: departmentId,
                Department_Name: departmentName,
                Department_HeadID: departmentHeadId,
                Room_ID: roomId,
            });
            
            // Set success message manually
            setMessage('Department added successfully!');
            
            // Reset the form fields
            setDepartmentId('');
            setDepartmentName('');
            setDepartmentHeadId('');
            setRoomId('');
        } catch (error) {
            console.error('Error adding department:', error);
            setMessage('Error adding department.');
        }
    };

    return (
        <div className="add-department-wrapper">
            <div className="add-department-container">
                <h2>Add Department</h2>
                <form onSubmit={handleSubmit}>
                    <table>
                        <tbody>
                            <tr>
                                <td><label>Department ID:</label></td>
                                <td>
                                    <input
                                        type="text"
                                        value={departmentId}
                                        onChange={(e) => setDepartmentId(e.target.value)}
                                        required
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td><label>Department Name:</label></td>
                                <td>
                                    <input
                                        type="text"
                                        value={departmentName}
                                        onChange={(e) => setDepartmentName(e.target.value)}
                                        required
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td><label>Department Head ID:</label></td>
                                <td>
                                    <input
                                        type="text"
                                        value={departmentHeadId}
                                        onChange={(e) => setDepartmentHeadId(e.target.value)}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td><label>Room ID:</label></td>
                                <td>
                                    <input
                                        type="text"
                                        value={roomId}
                                        onChange={(e) => setRoomId(e.target.value)}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td colSpan="2">
                                    <button type="submit">Add Department</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </form>
                {message && <p className="message">{message}</p>}
            </div>
        </div>
    );
};

export default AddDepartment;
