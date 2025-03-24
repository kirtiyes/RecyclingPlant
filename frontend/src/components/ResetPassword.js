import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/ResetPassword.css'; // Import your CSS file

const ResetPassword = () => {
    const [employeeId, setEmployeeId] = useState('');
    const [departmentId, setDepartmentId] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState(''); // Unified message state
    const navigate = useNavigate(); // Initialize the navigate function

    const handleSubmit = (e) => {
        e.preventDefault();
        setMessage(''); // Clear any previous messages

        const payload = {
            Employee_ID: employeeId,
            Department_ID: departmentId,
            New_Password: newPassword,
        };

        axios.post('http://localhost:5000/api/reset-password', payload)
            .then(response => {
                if (response.data.success) {
                    setMessage('Password reset successfully!'); // Set success message
                    // Navigate to the login page after a successful reset
                    setTimeout(() => {
                        navigate('/login'); // Adjust the route according to your app
                    }, 2000); // Optional: Delay for 2 seconds
                } else {
                    setMessage(`Error: ${response.data.message}`); // Set error message
                }
            })
            .catch(err => {
                console.error(err); // Log the error for debugging
                setMessage('An error occurred. Please try again later.'); // Set a generic error message
            });
    };

    return (
        <div className="reset-password-container">
            <div className="reset-password-form">
                <h2>Reset Password</h2>
                <form onSubmit={handleSubmit}>
                    <table>
                        <tbody>
                            <tr>
                                <td>
                                    <label htmlFor="employeeId">Employee ID:</label>
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        id="employeeId"
                                        value={employeeId}
                                        onChange={(e) => setEmployeeId(e.target.value)}
                                        required
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <label htmlFor="departmentId">Department ID:</label>
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        id="departmentId"
                                        value={departmentId}
                                        onChange={(e) => setDepartmentId(e.target.value)}
                                        required
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <label htmlFor="newPassword">New Password:</label>
                                </td>
                                <td>
                                    <input
                                        type="password"
                                        id="newPassword"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td colSpan="2">
                                    <button type="submit" className="reset-password-button">
                                        Reset Password
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </form>
                {message && <p className="reset-password-message">{message}</p>} {/* Display the unified message */}
                <div>
                    <button onClick={() => navigate('/login')} className="reset-password-button">Go to Login</button>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
