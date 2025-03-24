import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/EmpMac.css'

const EmployeeOperationsViewMac = () => {
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

    return (
        <div className='emp-machine-wrapper'>
        <div className='emp-machine-container' style={{ textAlign: 'center', marginTop: '50px' }}>
            <h2 className='emp-machine-title'>View Machines</h2>
            {error && <p>{error}</p>}
            <table className='emp-machine-table' style={{ margin: '0 auto', border: '1px solid black', padding: '10px' }}>
                <thead>
                    <tr>
                        <th>Machine ID</th>
                        <th>Machine Type</th>
                        <th>Room ID</th>
                        <th>Status</th>
                        <th>Last Maintenance Date</th>
                        <th>Next Scheduled Maintenance</th>
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
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        </div>
    );
};

export default EmployeeOperationsViewMac;
