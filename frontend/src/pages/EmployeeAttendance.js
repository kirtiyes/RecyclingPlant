import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Import Link
import '../styles/AdminEmployeeAttendance.css'

const EmployeeAttendance = () => {
    const [attendanceData, setAttendanceData] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch attendance records from the server
        axios.get('http://localhost:5000/api/employee_attendance')
            .then(response => setAttendanceData(response.data))
            .catch(error => {
                console.error('Error fetching attendance records:', error);
                setError('Could not fetch attendance records.'); // Update the error state
            });
    }, []);

    const handleRemoveAttendance = (attendanceId) => {
        if (window.confirm("Are you sure you want to remove this attendance record?")) {
            axios.delete(`http://localhost:5000/api/employee_attendance/${attendanceId}`)
                .then(() => {
                    setAttendanceData(attendanceData.filter(record => record.Attendance_ID !== attendanceId));
                })
                .catch(error => console.error('Error removing attendance record:', error));
        }
    };

    return (
        <div className='admin-attendance-wrapper'>
        <div className='admin-attendance-container' style={{ textAlign: 'center', marginTop: '50px' }}>
            <h2>Manage Employee Attendance</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error message */}
            <Link to="/admin/attendance/add">
                <button className='admin-attendance-add-button' style={{ padding: '10px 20px', marginBottom: '20px' }}>Add Attendance Record</button>
            </Link>
            <Link to="/admin/attendance/visualize">
                <button className='admin-attendance-add-button' style={{ padding: '10px 20px', marginLeft: '10px', marginBottom: '20px' }}>Visualize Attendance</button>
            </Link>
            <table className='admin-attendance-table' style={{ margin: '0 auto', border: '1px solid black', padding: '10px' }}>
                <thead>
                    <tr>
                        <th>Attendance ID</th>
                        <th>Employee ID</th>
                        <th>Employee Role</th>
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
                    {attendanceData.map(record => (
                        <tr key={record.Attendance_ID}>
                            <td>{record.Attendance_ID}</td>
                            <td>{record.Employee_ID}</td>
                            <td>{record.Employee_Role}</td>
                            <td>{record.Department_ID}</td>
                            <td>{new Date(record.Date).toLocaleDateString()}</td>
                            <td>{record.Shift_Type}</td>
                            <td>{record.Hours_Worked_Regular}</td>
                            <td>{record.Overtime_Hours}</td>
                            <td>{record.Leave_Type}</td>
                            <td>{record.Attendance_Rate}</td>
                            <td>
                                <div className='admin-attendance-buttons'>
                                <button className='admin-attendance-remove-button' onClick={() => handleRemoveAttendance(record.Attendance_ID)}>
                                    Remove
                                </button>
                                <Link to={`/admin/attendance/edit/${record.Attendance_ID}`}>
                                    <button className='admin-attendance-edit-button' style={{ marginLeft: '10px' }}>
                                        Edit
                                    </button>
                                </Link>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        </div>
    );
};

export default EmployeeAttendance;
