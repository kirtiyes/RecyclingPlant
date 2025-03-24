import React, { useState } from 'react';
import axios from 'axios';
import '../styles/AdminAddProcess.css'

const AddProcess = () => {
    const [process, setProcess] = useState({
        Process_ID: '',
        Process_Name: '',
        Description: '',
        Process_Type: '',
    });
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setProcess({ ...process, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/processes', process);
            // Optionally, show a success message or reset form fields
            if (response.data.success) {
                setMessage('Process added successfully!');
                setProcess({
                    Process_ID: '',
                    Process_Name: '',
                    Description: '',
                    Process_Type: '',
                });
            } else {
                setMessage((response.data.message));
            }
        } catch (error) {
            console.error('Error adding process:', error);
            setMessage('An error occurred. Please try again.');
        }
    };

    return (
        <div className='add-process-wrapper1'>
        <div className='add-process-wrapper'>
        <div className='add-process-container' style={{ textAlign: 'center', marginTop: '50px' }}>
            <h2>Add Process</h2>
            <form onSubmit={handleSubmit}>
                <table style={{ margin: '0 auto' }}>
                    <tbody>
                        <tr>
                            <td><label>Process ID:</label></td>
                            <td>
                                <input
                                    type="text"
                                    name="Process_ID"
                                    value={process.Process_ID}
                                    onChange={handleChange}
                                    required
                                />
                            </td>
                        </tr>
                        <tr>
                            <td><label>Process Name:</label></td>
                            <td>
                                <input
                                    type="text"
                                    name="Process_Name"
                                    value={process.Process_Name}
                                    onChange={handleChange}
                                    required
                                />
                            </td>
                        </tr>
                        <tr>
                            <td><label>Description:</label></td>
                            <td>
                                <input
                                    type="text"
                                    name="Description"
                                    value={process.Description}
                                    onChange={handleChange}
                                    required
                                />
                            </td>
                        </tr>
                        <tr>
                            <td><label>Process Type:</label></td>
                            <td>
                                <input
                                    type="text"
                                    name="Process_Type"
                                    value={process.Process_Type}
                                    onChange={handleChange}
                                    required
                                />
                            </td>
                        </tr>
                        <tr>
                            <td colSpan="2">
                                <button type="submit">Add Process</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </form>
            {message && <p>{message}</p>}
        </div>
        </div>
        </div>
    );
};

export default AddProcess;
