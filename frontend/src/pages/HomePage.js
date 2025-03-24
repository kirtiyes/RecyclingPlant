import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/HomePage.css'; // Import your CSS file

const HomePage = () => {
    return (
        <div className="home-container">
            <h1>Welcome to the Recycling Plant</h1>
            <p>Please login to access the system.</p>
            <Link to="/login">
                <button className="login-button">
                    Login
                </button>
            </Link>
        </div>
    );
};

export default HomePage;
