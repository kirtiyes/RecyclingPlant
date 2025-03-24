import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import '../styles/Layout.css'; // Import your CSS file

const Layout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(false); // State to manage loading

    const handleBack = () => {
        navigate(-1);
    };

    const handleLogout = async () => {
        setLoading(true); // Set loading to true when starting logout process
        try {
            const response = await fetch('http://localhost:5000/api/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ /* Add any necessary data here if needed */ }),
            });

            if (!response.ok) {
                throw new Error('Logout failed. Please try again.');
            }

            // Clear user role from local storage
            //localStorage.removeItem('userRole');
            // Optionally, clear any other user data stored in local storage or session storage
            // localStorage.removeItem('otherUserData');

            // Redirect to login page after successful logout
            navigate('/login');
        } catch (error) {
            console.error('Error during logout:', error);
            alert(error.message); // Display error message to user
        } finally {
            setLoading(false); // Set loading back to false
        }
    };

    const handleViewFloorPlan = () => {
        navigate('/floorplan');
    };

    const handleDashboardRedirect = () => {
        const role = localStorage.getItem('userRole');
        if (role === 'Admin') {
            navigate('/admin-dashboard');
        } else if (role === 'Manager-Operations') {
            navigate('/manager-operations-dashboard');
        } else if (role === 'Manager-Maintenance') {
            navigate('/manager-maintenance-dashboard');
        } else if (role === 'Employee-Operations') {
            navigate('/employee-operations-dashboard');
        } else if (role === 'Employee-Maintenance') {
            navigate('/employee-maintenance-dashboard');
        }
    };

    const handleViewProfile = () => {
        navigate('/profile');
    };

    const handleViewAttendance = () => {
        navigate('/view-attendance');
    };

    const showBackButton = !['/', '/login', '/reset-password'].includes(location.pathname);
    const showLogoutButton = !['/', '/login', '/reset-password'].includes(location.pathname);
    const showFloorPlanButton = !['/', '/login', '/reset-password'].includes(location.pathname);
    const showDashboardButton = !['/', '/login', '/reset-password'].includes(location.pathname);
    const showProfileButton = !['/', '/login', '/reset-password'].includes(location.pathname);
    const showAttendanceButton = !['/', '/login', '/reset-password'].includes(location.pathname);

    return (
        <div className="layout-container">
            <div className="button-container">
                <div className="left-buttons">
                    {showBackButton && (
                        <button className="button" onClick={handleBack}>
                            Back
                        </button>
                    )}
                    {showFloorPlanButton && (
                        <button className="button" onClick={handleViewFloorPlan}>
                            View Floor Plan
                        </button>
                    )}
                    {showDashboardButton && (
                        <button className="button" onClick={handleDashboardRedirect}>
                            Dashboard
                        </button>
                    )}
                    {showAttendanceButton && (
                        <button className="button" onClick={handleViewAttendance}>
                            View Attendance
                        </button>
                    )}
                </div>
                <div className="right-buttons">
                    {showProfileButton && (
                        <button className="button" onClick={handleViewProfile}>
                            Profile
                        </button>
                    )}
                    {showLogoutButton && (
                        <button className="button" onClick={handleLogout} disabled={loading}>
                            {loading ? 'Logging out...' : 'Logout'}
                        </button>
                    )}
                </div>
            </div>
            <Outlet />
        </div>
    );
};

export default Layout;
