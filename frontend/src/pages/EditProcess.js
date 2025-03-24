import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../styles/AdminEditProcess.css'

const EditProcess = () => {
    const { id } = useParams();
    const [process, setProcess] = useState({
        Process_ID: '',
        Process_Name: '',
        Description: '',
        Process_Type: '',
    });

    const [message, setMessage] = useState(''); // State for showing success or error messages

    useEffect(() => {
        const fetchProcess = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/processes/${id}`);
                setProcess(response.data); 
            } catch (error) {
                console.error('Error fetching process:', error);
                setMessage('Error fetching process data'); // Set error message
            }
        };

        fetchProcess();
    }, [id]);

    const handleChange = (e) => {
        setProcess({ ...process, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:5000/api/processes/${id}`, process);
            setMessage('Process updated successfully!'); // Set success message
        } catch (error) {
            console.error('Error updating process:', error);
            setMessage('Error updating process: ' + (error.response?.data?.message || error.message)); // Set error message
        }
    };

    return (
        <div className='edit-process-wrapper'>
        <div className='edit-process-container' style={{ textAlign: 'center', marginTop: '50px' }}>
            <h2>Edit Process</h2>
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
                                    disabled
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
                                <button type="submit">Update Process</button>
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

export default EditProcess;