import React, { useState } from 'react';
import axios from 'axios';
import '../styles/AdminAddMachine.css'

const AddMachine = () => {
    const [machineId, setMachineId] = useState('');
    const [machineType, setMachineType] = useState('');
    const [roomId, setRoomId] = useState('');
    const [status, setStatus] = useState('');
    const [lastMaintenanceDate, setLastMaintenanceDate] = useState('');
    const [nextScheduledMaintenance, setNextScheduledMaintenance] = useState('');
    const [assignedEmployeeId, setAssignedEmployeeId] = useState('');
    const [message, setMessage] = useState(''); // Store error or success message

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/machines', {
                Machine_ID: machineId,
                Machine_Type: machineType,
                Room_ID: roomId,
                Status: status,
                Last_Maintenance_Date: lastMaintenanceDate,
                Next_Scheduled_Maintenance: nextScheduledMaintenance,
                Assigned_EmployeeID: assignedEmployeeId,            
            });
            
            // Check if the machine was added successfully
            if (response.data.success) {
                setMessage('Machine added successfully!');
                // Optionally reset form fields after success
                setMachineId('');
                setMachineType('');
                setRoomId('');
                setStatus('');
                setLastMaintenanceDate('');
                setNextScheduledMaintenance('');
                setAssignedEmployeeId('');
            } else {
                setMessage(response.data.message); // Show the error message if failed
            }
        } catch (error) {
            if (error.response && error.response.data) {
                setMessage(error.response.data.message); // Capture backend error
            } else {
                setMessage('An error occurred. Please try again.');
            }
        }
    };

    return (
        <div className="add-machine-wrapper">
        <div className="add-machine-container" style={{ textAlign: 'center', marginTop: '50px' }}>
            <h2>Add Machine</h2>
            <form onSubmit={handleSubmit}>
                <table style={{ margin: '0 auto' }}>
                    <tbody>
                        <tr>
                            <td><label>Machine ID:</label></td>
                            <td>
                                <input
                                    type="text"
                                    value={machineId}
                                    onChange={(e) => setMachineId(e.target.value)}
                                    required
                                />
                            </td>
                        </tr>
                        <tr>
                            <td><label>Machine Type:</label></td>
                            <td>
                                <input
                                    type="text"
                                    value={machineType}
                                    onChange={(e) => setMachineType(e.target.value)}
                                    required
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
                                    required
                                />
                            </td>
                        </tr>
                        <tr>
                            <td><label>Status:</label></td>
                            <td>
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    required
                                >
                                    <option value="">Status</option> {/* Default placeholder */}
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
                                    value={lastMaintenanceDate}
                                    onChange={(e) => setLastMaintenanceDate(e.target.value)}
                                    required
                                />
                            </td>
                        </tr>
                        <tr>
                            <td><label>Next Scheduled Maintenance:</label></td>
                            <td>
                                <input
                                    type="date"
                                    value={nextScheduledMaintenance}
                                    onChange={(e) => setNextScheduledMaintenance(e.target.value)}
                                    required
                                />
                            </td>
                        </tr>
                        <tr>
                            <td><label>Assigned Employee ID:</label></td>
                            <td>
                                <input
                                    type="text"
                                    value={assignedEmployeeId}
                                    onChange={(e) => setAssignedEmployeeId(e.target.value)}
                                    required
                                />
                            </td>
                        </tr>
                        <tr>
                            <td colSpan="2">
                                <button type="submit">Add Machine</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </form>
            {/* Display the error or success message */}
            {message && <p>{message}</p>}
        </div>
        </div>
    );
};

export default AddMachine;
