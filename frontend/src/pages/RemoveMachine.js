import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const RemoveMachine = () => {
    const { id } = useParams(); // Get the machine ID from the URL parameters
    const navigate = useNavigate(); // For navigation after deletion
    const [machine, setMachine] = useState(null); // State to store machine data
    const [message, setMessage] = useState(''); // State for feedback message

    useEffect(() => {
        // Fetch the machine data to display
        const fetchMachine = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/machines/${id}`);
                setMachine(response.data); // Assuming the API returns the machine object directly
            } catch (error) {
                console.error('Error fetching machine data:', error);
                setMessage('Error fetching machine data.');
            }
        };

        fetchMachine();
    }, [id]);

    const handleDelete = async () => {
        // Confirm deletion
        const confirmDelete = window.confirm('Are you sure you want to delete this machine?');
        if (!confirmDelete) return; // Exit if the user cancels

        try {
            await axios.delete(`http://localhost:5000/api/machines/${id}`);
            alert('Machine deleted successfully');
            navigate('/admin/machines/view'); // Redirect to the machines view page
        } catch (error) {
            console.error('Error deleting machine:', error);
            setMessage('Error deleting machine.');
        }
    };

    if (!machine) return <div>Loading...</div>; // Show loading if data is not yet available

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h2>Remove Machine</h2>
            <p>Are you sure you want to delete the following machine?</p>
            <table style={{ margin: '0 auto', width: '50%' }}>
                <tbody>
                    <tr>
                        <td><strong>Machine ID:</strong></td>
                        <td>{machine.Machine_ID}</td>
                    </tr>
                    <tr>
                        <td><strong>Machine Type:</strong></td>
                        <td>{machine.Machine_Type}</td>
                    </tr>
                    <tr>
                        <td><strong>Room ID:</strong></td>
                        <td>{machine.Room_ID}</td>
                    </tr>
                    <tr>
                        <td><strong>Status:</strong></td>
                        <td>{machine.Status}</td>
                    </tr>
                    <tr>
                        <td><strong>Last Maintenance Date:</strong></td>
                        <td>{machine.Last_Maintenance_Date}</td>
                    </tr>
                    <tr>
                        <td><strong>Next Scheduled Maintenance:</strong></td>
                        <td>{machine.Next_Scheduled_Maintenance}</td>
                    </tr>
                    <tr>
                        <td><strong>Assigned Employee ID:</strong></td>
                        <td>{machine.Assigned_EmployeeID}</td>
                    </tr>
                </tbody>
            </table>
            <button onClick={handleDelete} style={{ marginTop: '20px' }}>Confirm Delete</button>
            {message && <p>{message}</p>}
            <button onClick={() => navigate('/admin/machines/view')} style={{ marginTop: '10px' }}>Cancel</button>
        </div>
    );
};

export default RemoveMachine;
