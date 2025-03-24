import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Profile.css'; // Import the CSS file

const Profile = () => {
    const [profileData, setProfileData] = useState({
        Employee_ID: '',
        Employee_Name: '',
        Employee_Role: '',
        Salary: '',
        Department_ID: '',
        Date_of_Joining: '',
        Contact_Details: '',
        Address: '',
        Last_Paid_Date: '',
        Salary_Updated_On: ''
    });
    const [message, setMessage] = useState(''); // Unified message state
    const role = localStorage.getItem('userRole'); // Logged-in user role
    const employeeId = localStorage.getItem('employeeId'); // Logged-in user ID

    useEffect(() => {
        // Fetch profile data when component loads
        const fetchProfileData = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/employees/${employeeId}`);
                setProfileData(response.data); // Set the profile data
            } catch (error) {
                setMessage('Error fetching profile data.'); // Use unified message state
                console.error(error);
            }
        };

        fetchProfileData();
    }, [employeeId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
    
        // Convert dates to the proper format
        const updatedProfileData = {
            ...profileData,
            Date_of_Joining: profileData.Date_of_Joining ? new Date(profileData.Date_of_Joining).toISOString().split('T')[0] : null,
            Last_Paid_Date: profileData.Last_Paid_Date ? new Date(profileData.Last_Paid_Date).toISOString().split('T')[0] : null,
            Salary_Updated_On: profileData.Salary_Updated_On ? new Date(profileData.Salary_Updated_On).toISOString().split('T')[0] : null,
        };
    
        try {
            const response = await axios.put(`http://localhost:5000/api/profile/${employeeId}`, {
                ...updatedProfileData,
                role // Pass the role to the API
            });
            if (response.data.success) {
                setMessage('Profile updated successfully!'); // Set success message
            } else {
                setMessage(`Error: ${response.data.message}`); // Set error message
            }
        } catch (err) {
            setMessage('Error updating profile.'); // Set a generic error message
            console.error(err);
        }
    };

    return (
        <div className="profile-container">
            <div className="profile-form">
            <h2 className="profile-title">Profile</h2>
            <form onSubmit={handleUpdate}>
                <table className="profile-table">
                    <tbody>
                        <tr>
                            <td><label>Employee ID:</label></td>
                            <td>
                                <input
                                    type="text"
                                    name="Employee_ID"
                                    value={profileData.Employee_ID}
                                    onChange={handleChange}
                                    disabled
                                />
                            </td>
                        </tr>
                        <tr>
                            <td><label>Employee Name:</label></td>
                            <td>
                                <input
                                    type="text"
                                    name="Employee_Name"
                                    value={profileData.Employee_Name || ''}
                                    onChange={handleChange}
                                    required
                                />
                            </td>
                        </tr>
                        <tr>
                            <td><label>Employee Role:</label></td>
                            <td>
                                <input
                                    type="text"
                                    name="Employee_Role"
                                    value={profileData.Employee_Role}
                                    onChange={handleChange}
                                    disabled
                                />
                            </td>
                        </tr>
                        <tr>
                            <td><label>Salary:</label></td>
                            <td>
                                <input
                                    type="number"
                                    name="Salary"
                                    value={profileData.Salary || ''}
                                    onChange={handleChange}
                                    disabled
                                />
                            </td>
                        </tr>
                        <tr>
                            <td><label>Department ID:</label></td>
                            <td>
                                <input
                                    type="text"
                                    name="Department_ID"
                                    value={profileData.Department_ID || ''}
                                    onChange={handleChange}
                                    disabled
                                />
                            </td>
                        </tr>
                        <tr>
                            <td><label>Date of Joining:</label></td>
                            <td>
                                <input
                                    type="date"
                                    name="Date_of_Joining"
                                    value={profileData.Date_of_Joining ? new Date(profileData.Date_of_Joining).toISOString().split('T')[0] : ''}
                                    onChange={handleChange}
                                    disabled
                                />
                            </td>
                        </tr>
                        <tr>
                            <td><label>Contact Details:</label></td>
                            <td>
                                <input
                                    type="text"
                                    name="Contact_Details"
                                    value={profileData.Contact_Details || ''}
                                    onChange={handleChange}
                                    required
                                />
                            </td>
                        </tr>
                        <tr>
                            <td><label>Address:</label></td>
                            <td>
                                <input
                                    type="text"
                                    name="Address"
                                    value={profileData.Address || ''}
                                    onChange={handleChange}
                                    required
                                />
                            </td>
                        </tr>
                        <tr>
                            <td><label>Last Paid Date:</label></td>
                            <td>
                                <input
                                    type="date"
                                    name="Last_Paid_Date"
                                    value={profileData.Last_Paid_Date ? new Date(profileData.Last_Paid_Date).toISOString().split('T')[0] : ''}
                                    onChange={handleChange}
                                    disabled
                                />
                            </td>
                        </tr>
                        <tr>
                            <td><label>Salary Updated On:</label></td>
                            <td>
                                <input
                                    type="date"
                                    name="Salary_Updated_On"
                                    value={profileData.Salary_Updated_On ? new Date(profileData.Salary_Updated_On).toISOString().split('T')[0] : ''}
                                    onChange={handleChange}
                                    disabled
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>
                <button type="submit" className="update-button">
                    Update Profile
                </button>
            </form>
            {message && <p className="message">{message}</p>} {/* Conditionally display the message */}
        </div>
        </div>
    );
};

export default Profile;
