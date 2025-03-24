import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../styles/EmpEdit.css'

const EmployeeOperationsEditMat = ({ userRole }) => {
    const { id } = useParams();
    const [material, setMaterial] = useState({
        Material_ID: '',
        Material_Name: '',
        Source: '',
        Status: '', // Initialize as an empty string
        Process_ID: '',
    });

    const [message, setMessage] = useState(''); // State for showing success or error messages

    useEffect(() => {
        const fetchMaterial = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/materials/${id}`);
                setMaterial(response.data); // Assuming response contains the material object
            } catch (error) {
                console.error('Error fetching material:', error);
            }
        };

        fetchMaterial();
    }, [id]);

    const handleChange = (e) => {
        setMaterial({ ...material, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:5000/api/materials/${id}?role=${userRole}`, material);
            setMessage('Material updated successfully!'); // Set success message
        } catch (error) {
            console.error('Error updating material:', error);
            setMessage('Error updating material: ' + (error.response?.data?.message || error.message)); // Set error message
        }
    };

    return (
        <div className='edit-emp-wrapper'>
        <div className='edit-emp-container' style={{ textAlign: 'center', marginTop: '50px' }}>
            <h2>Edit Material</h2>
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
                                    disabled
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
                                    disabled
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
                                    value={material.Status} // Current status value will be shown here
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
                                <button type="submit">Update Material</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </form>

            {message && <p>{message}</p>} {/* Conditionally display the message */}
        </div>
        </div>
    );
};

export default EmployeeOperationsEditMat;