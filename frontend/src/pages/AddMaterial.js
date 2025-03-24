import React, { useState } from 'react';
import axios from 'axios';
import '../styles/AdminAddMaterial.css'

const AddMaterial = () => {
    const [material, setMaterial] = useState({
        Material_ID: '',
        Material_Name: '',
        Source: '',
        Status: 'Pending', // Default to 'Pending'
        Process_ID: '',
    });
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setMaterial({ ...material, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/materials', material);
            // Optionally, show a success message or reset form fields
            if (response.data.success) {
                setMessage('Material added successfully!');
                setMaterial({
                    Material_ID: '',
                    Material_Name: '',
                    Source: '',
                    Status: 'Pending', // Reset to default
                    Process_ID: '',
                });
            } else {
                setMessage((response.data.message));
            }
        } catch (error) {
            console.error('Error adding material:', error);
            setMessage('An error occurred. Please try again.');
        }
    };

    return (
        <div className='add-material-wrapper'>
        <div className='add-material-container' style={{ textAlign: 'center', marginTop: '50px' }}>
            <h2>Add Material</h2>
            <form onSubmit={handleSubmit}>
                <table style={{ margin: '0 auto' }}>
                    <tbody>
                        <tr>
                            <td><label>Material ID:</label></td>
                            <td>
                                <input
                                    type="text"
                                    name="Material_ID"
                                    value={material.Material_ID}
                                    onChange={handleChange}
                                    required
                                />
                            </td>
                        </tr>
                        <tr>
                            <td><label>Material Name:</label></td>
                            <td>
                                <input
                                    type="text"
                                    name="Material_Name"
                                    value={material.Material_Name}
                                    onChange={handleChange}
                                    required
                                />
                            </td>
                        </tr>
                        <tr>
                            <td><label>Source:</label></td>
                            <td>
                                <input
                                    type="text"
                                    name="Source"
                                    value={material.Source}
                                    onChange={handleChange}
                                    required
                                />
                            </td>
                        </tr>
                        <tr>
                            <td><label>Status:</label></td>
                            <td>
                                <select
                                    name="Status"
                                    value={material.Status}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="In Process">In Process</option>
                                    <option value="Completed">Completed</option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td><label>Process ID:</label></td>
                            <td>
                                <input
                                    type="text"
                                    name="Process_ID"
                                    value={material.Process_ID}
                                    onChange={handleChange}
                                    required
                                />
                            </td>
                        </tr>
                        <tr>
                            <td colSpan="2">
                                <button type="submit">Add Material</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </form>
            {message && <p>{message}</p>}
        </div>
        </div>
    );
};

export default AddMaterial;
