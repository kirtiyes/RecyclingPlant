import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/LoginPage.css'; // Import the CSS for styling

const LoginForm = ({ onLoginSuccess }) => {
    const [employeeId, setEmployeeId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await axios.post('http://localhost:5000/api/login', {
                Employee_ID: employeeId,
                Password: password,
            });

            if (response.data.success) {
                const role = response.data.role;
                localStorage.setItem('userRole', role);
                localStorage.setItem('employeeId', employeeId); // Store employee ID
                onLoginSuccess(role); // Call the function passed from LoginPage

                // Redirect based on role
                switch (role) {
                    case 'Admin':
                        navigate('/admin-dashboard');
                        break;
                    case 'Manager-Operations':
                        navigate('/manager-operations-dashboard');
                        break;
                    case 'Manager-Maintenance':
                        navigate('/manager-maintenance-dashboard');
                        break;
                    case 'Employee-Operations':
                        navigate('/employee-operations-dashboard');
                        break;
                    case 'Employee-Maintenance':
                        navigate('/employee-maintenance-dashboard');
                        break;
                    default:
                        break;
                }
            } else {
                setError('Invalid credentials. Please try again.');
            }
        } catch (err) {
            setError('An error occurred. Please try again later.');
            console.error(err);
        }
    };

    return (
        <div className="login-form">
            <h2>Login</h2>
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
                                <label htmlFor="password">Password:</label>
                            </td>
                            <td>
                                <input
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </td>
                        </tr>
                        <tr>
                            <td colSpan="2">
                                <button type="submit" className="login-button">
                                    Login
                                </button>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan="2">
                                <a href="/reset-password" className="forgot-password">Forgot your password?</a>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </form>
            {error && <p style={{ color: 'white', fontSize:'1em', marginLeft: '45px', marginTop: '20px'}}>{error}</p>}
        </div>
    );
};

export default LoginForm;
