import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../styles/ManMainAtt.css'

const ManagerMaintenanceViewEmpAtt = ({ userRole }) => { // Pass userRole as a prop
    const [attendanceData, setAttendanceData] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch attendance records based on user role
        axios.get(`http://localhost:5000/api/employee_attenenanance/manager?role=${userRole}`) // Use userRole in the URL
            .then(response => {
                // Ensure attendanceData is always an array
                setAttendanceData(response.data.attendance || []); // Handle if attendance is missing
            })
            .catch(error => {
                console.error('Error fetching attendance records:', error);
                setError('Could not fetch attendance records.');
            });
    }, [userRole]); // Re-run effect if userRole changes

    return (
        <div className='manmain-attendance-wrapper'>
        <div className='manmain-attendance-container' style={{ textAlign: 'center', marginTop: '50px' }}>
            <h2>Manage Employee Attendance</h2>
            <Link to="/managermaintenance/employee_attendance/viz">
                <button className='manmain-attendance-add-button' style={{ padding: '10px 20px', marginBottom: '10px' }}>Visualize Attendance</button>
            </Link>
            <table className='manmain-attendance-table' style={{ margin: '0 auto', border: '1px solid black', padding: '10px' }}>
                <thead>
                    <tr>
                        <th>Attendance ID</th>
                        <th>Employee ID</th>
                        <th>Department ID</th>
                        <th>Date</th>
                        <th>Shift Type</th>
                        <th>Hours Worked Regular</th>
                        <th>Overtime Hours</th>
                        <th>Leave Type</th>
                        <th>Attendance Rate</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {attendanceData.length > 0 ? (
                        attendanceData.map(record => (
                            <tr key={record.Attendance_ID}>
                                <td>{record.Attendance_ID}</td>
                                <td>{record.Employee_ID}</td>
                                <td>{record.Department_ID}</td>
                                <td>{new Date(record.Date).toLocaleDateString()}</td>
                                <td>{record.Shift_Type}</td>
                                <td>{record.Hours_Worked_Regular}</td>
                                <td>{record.Overtime_Hours}</td>
                                <td>{record.Leave_Type}</td>
                                <td>{record.Attendance_Rate}</td>
                                <td>
                                <Link to={`/managermaintenance/employee_attendance/edit/${record.Attendance_ID}`}>
                                    <button className='manmain-attendance-edit-button' style={{ marginLeft: '10px' }}>
                                            Edit
                                        </button>
                                </Link>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="11">No attendance records found.</td>
                        </tr>
                    )}
                </tbody>
            </table>
            {error && <p>{error}</p>}
        </div> 
        </div>
    );
};

export default ManagerMaintenanceViewEmpAtt;