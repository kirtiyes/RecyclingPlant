import React, { useState } from 'react';
import axios from 'axios';

const RemoveEmployee = () => {
    const [employeeId, setEmployeeId] = useState('');
    const [message, setMessage] = useState('');

    const handleRemoveEmployee = () => {
        const confirmDelete = window.confirm('Are you sure you want to delete this machine?');
        if (!confirmDelete) return; // Exit if the user cancels

        if (!employeeId) {
            setMessage('Please enter an Employee ID.');
            return;
        }

        console.log(`Removing employee with ID: ${employeeId}`);
        axios.delete(`http://localhost:5000/api/employees/${employeeId}`)
            .then(() => {
                setMessage('Employee removed successfully!');
                setEmployeeId(''); // Clear the input field
            })
            .catch(error => {
                setMessage('Error removing employee. Please check the ID.');
                console.error('Error removing employee:', error);
            });
    };    

    return (
        <div>
            <h2>Remove Employee</h2>
            <input
                type="text"
                placeholder="Enter Employee ID"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
            />
            <button onClick={handleRemoveEmployee}>Remove Employee</button>
            {message && <p>{message}</p>} {/* Display feedback message */}
        </div>
    );
};

export default RemoveEmployee;
