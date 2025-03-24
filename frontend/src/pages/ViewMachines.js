import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Import Link
import '../styles/ViewMachines.css';

const ViewMachines = () => {
    const [machines, setMachines] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch machines from the server
        axios.get('http://localhost:5000/api/machines')
            .then(response => setMachines(response.data))
            .catch(err => {
                console.error('Error fetching machines:', err);
                setError('Error fetching machines. Please try again later.');
            });
    }, []);

    const handleRemoveMachine = (machineId) => {
        if (window.confirm("Are you sure you want to remove this machine?")) {
            axios.delete(`http://localhost:5000/api/machines/${machineId}`)
                .then(() => {
                    setMachines(machines.filter(machine => machine.Machine_ID !== machineId));
                })
                .catch(error => console.error('Error removing machine:', error));
        }
    };

    return (
        <div className="view-machines-wrapper">
        <div className="view-machines-container" style={{ textAlign: 'center', marginTop: '50px' }}>
            <h2 className='view-machines-titles'>Manage Machines</h2>
            <Link to="/admin/machines/add"><button className='view-machines-add-button' style={{ padding: '10px 20px', marginBottom: '20px' }}>Add Machine</button></Link>
            {error && <p className="error-message">{error}</p>}
            <table className='view-machines-table' style={{ margin: '0 auto', border: '1px solid black', padding: '10px' }}>
                <thead>
                    <tr>
                        <th>Machine ID</th>
                        <th>Machine Type</th>
                        <th>Room ID</th>
                        <th>Status</th>
                        <th>Last Maintenance Date</th>
                        <th>Next Scheduled Maintenance</th>
                        <th>Assigned Employee ID</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {machines.map((machine) => (
                        <tr key={machine.Machine_ID}>
                            <td>{machine.Machine_ID}</td>
                            <td>{machine.Machine_Type}</td>
                            <td>{machine.Room_ID}</td>
                            <td>{machine.Status}</td>
                            <td>{new Date(machine.Last_Maintenance_Date).toLocaleDateString()}</td>
                            <td>{new Date(machine.Next_Scheduled_Maintenance).toLocaleDateString()}</td>
                            <td>{machine.Assigned_EmployeeID}</td>
                            <td>
                                <button className='view-machines-remove-button' onClick={() => handleRemoveMachine(machine.Machine_ID)}>
                                    Remove
                                </button>
                                {/* Render the Edit button for this specific machine */}
                                <Link to={`/admin/machines/edit/${machine.Machine_ID}`}>
                                    <button className='view-machines-edit-button' style={{ marginLeft: '10px' }}>Edit</button>
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        </div>
    );
};

export default ViewMachines;
