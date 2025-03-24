import React, { useState } from 'react';
import LoginForm from '../components/LoginForm';
import '../styles/LoginPage.css'; // Import your CSS file

const LoginPage = () => {
    const [role, setRole] = useState('');

    const handleLoginSuccess = (userRole) => {
        // Set the role in the state after a successful login
        setRole(userRole);
    };

    return (
        <div className="login-container">
            {role ? (
                <div>
                    <h2>Welcome!</h2>
                    <p>Your role is: <strong>{role}</strong></p>
                </div>
            ) : (
                <LoginForm onLoginSuccess={handleLoginSuccess} />
            )}
        </div>
    );
};

export default LoginPage;
