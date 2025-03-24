import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../styles/ManMainEditMac.css'

const ManagerOperationsEditMac = ({ userRole }) => {
    const { id } = useParams(); // Get the machine ID from the URL parameters
    console.log('Editing machine with ID:', id);
    const [machine, setMachine] = useState({
        Machine_ID: '',
        Machine_Type: '',
        Room_ID: '',
        Status: '',
        Last_Maintenance_Date: '',
        Next_Scheduled_Maintenance: '',
        Assigned_EmployeeID: ''
    });

    const [message, setMessage] = useState(''); // State for showing success or error messages

    useEffect(() => {
        // Fetch the machine data to populate the form
        const fetchMachine = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/machines/${id}`);
                setMachine(response.data); // Assuming the API returns the machine object directly
            } catch (error) {
                console.error('Error fetching machine data:', error);
            }
        };

        fetchMachine();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setMachine(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Submitting machine data:', machine); // Debug log to check machine data
    
        try {
            // Send updated machine data to the server
            const response = await axios.put(`http://localhost:5000/api/machines/${id}?role=${userRole}`, machine);
            setMessage('Machine updated successfully!'); // Set success message
            console.log('Response:', response.data); // Debug log to check response
        } catch (error) {
            console.error('Error updating machine:', error);
            setMessage('Error updating machine: ' + (error.response?.data?.message || error.message)); // Set error message
        }
    };    

    return (
        <div className='edit-manmainmac-wrapper'>
        <div className='edit-manmainmac-container' style={{ textAlign: 'center', marginTop: '50px' }}>
            <h2>Edit Machine</h2>
            <form onSubmit={handleSubmit}>
                <table style={{ margin: '0 auto' }}>
                    <tbody>
                        <tr>
                            <td><label>Machine ID:</label></td>
                            <td>
                                <input
                                    type="text"
                                    name="Machine_ID"
                                    value={machine.Machine_ID}
                                    onChange={handleChange}
                                    disabled
                                />
                            </td>
                        </tr>
                        <tr>
                            <td><label>Machine Type:</label></td>
                            <td>
                                <input
                                    type="text"
                                    name="Machine_Type"
                                    value={machine.Machine_Type}
                                    onChange={handleChange}
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
                                    value={machine.Room_ID}
                                    onChange={handleChange}
                                    disabled
                                />
                            </td>
                        </tr>
                        <tr>
                            <td><label>Status:</label></td>
                            <td>
                                <select
                                    name="Status"
                                    value={machine.Status} // Current status value will be shown here
                                    onChange={handleChange}
                                    disabled
                                >
                                    <option value="Operational">Operational</option>
                                    <option value="Under Maintenance">Under Maintenance</option>
                                    <option value="Needs Attention">Needs Attention</option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td><label>Last Maintenance Date:</label></td>
                            <td>
                                <input
                                    type="date"
                                    name="Last_Maintenance_Date"
                                    value={machine.Last_Maintenance_Date ? new Date(machine.Last_Maintenance_Date).toISOString().split('T')[0] : ''}
                                    onChange={handleChange}
                                    disabled
                                />
                            </td>
                        </tr>
                        <tr>
                            <td><label>Next Scheduled Maintenance:</label></td>
                            <td>
                                <input
                                    type="date"
                                    name="Next_Scheduled_Maintenance"
                                    value={machine.Next_Scheduled_Maintenance ? new Date(machine.Next_Scheduled_Maintenance).toISOString().split('T')[0] : ''}
                                    onChange={handleChange}
                                    disabled
                                />
                            </td>
                        </tr>
                        <tr>
                            <td><label>Assigned Employee ID:</label></td>
                            <td>
                                <input
                                    type="text"
                                    name="Assigned_EmployeeID"
                                    value={machine.Assigned_EmployeeID}
                                    onChange={handleChange}
                                    disabled
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

            {message && <p>{message}</p>} {/* Conditionally display the message */}
        </div>
        </div>
    );
};

export default ManagerOperationsEditMac;
