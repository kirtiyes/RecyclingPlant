import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Import Link
import '../styles/ViewProcesses.css'

const ViewProcesses = () => {
    const [processes, setProcesses] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch materials from the server
        axios.get('http://localhost:5000/api/processes')
            .then(response => setProcesses(response.data))
            .catch(error => console.error('Error fetching processes:', error));
    }, []);

    const handleRemoveProcess = (processId) => {
        if (window.confirm("Are you sure you want to remove this process?")) {
            axios.delete(`http://localhost:5000/api/processes/${processId}`)
                .then(() => {
                    setProcesses(processes.filter(pro => pro.Process_ID !== processId));
                })
                .catch(error => console.error('Error removing process:', error));
        }
    };

    return (
        <div className='admin-processes-wrapper'>
        <div className='admin-processes-container' style={{ textAlign: 'center', marginTop: '50px' }}>
            <h2 className='admin-processes-title'>Manage Processes</h2>
            <Link to="/admin/processes/add">
                <button className='admin-processes-add-button' style={{ padding: '10px 20px', marginBottom: '20px' }}>Add Process</button>
            </Link>
            <table className='admin-processes-table' style={{ margin: '0 auto', border: '1px solid black', padding: '10px' }}>
                <thead>
                    <tr>
                        <th>Process ID</th>
                        <th>Process Name</th>
                        <th>Description</th>
                        <th>Process Type</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {processes.map(process => (
                        <tr key={process.Process_ID}>
                            <td>{process.Process_ID}</td>
                            <td>{process.Process_Name}</td>
                            <td>{process.Description}</td>
                            <td>{process.Process_Type}</td>
                            <td>
                                <button className='admin-processes-remove-button' onClick={() => handleRemoveProcess(process.Process_ID)}>
                                    Remove
                                </button>
                                <Link to={`/admin/processes/edit/${process.Process_ID}`}>
                                    <button className='admin-processes-edit-button' style={{ marginLeft: '10px' }}>
                                        Edit
                                    </button>
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

export default ViewProcesses;
