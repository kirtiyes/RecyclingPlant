import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link
import '../styles/ViewOwnAttendance.css'

const ViewOwnAttendance = () => {
    const [attendanceData, setAttendanceData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAttendance = async () => {
            const employeeId = localStorage.getItem('employeeId'); // Assuming Employee ID is stored in localStorage
            try {
                const response = await fetch(`http://localhost:5000/api/attendance/${employeeId}`);

                if (!response.ok) {
                    throw new Error('Failed to fetch attendance data.');
                }

                const data = await response.json();

                // Sort data by Attendance_ID in descending order (extract numeric part)
                const sortedData = data.attendance.sort((a, b) => {
                    const numA = parseInt(a.Attendance_ID.match(/\d+/)); // Extract numeric part of Attendance_ID
                    const numB = parseInt(b.Attendance_ID.match(/\d+/));
                    return numB - numA; // Sort in descending order
                });

                setAttendanceData(sortedData);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAttendance();
    }, []);

    if (loading) {
        return (
            <div className="attendance-center-container">
                <div>Loading attendance data...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="attendance-center-container">
                <div>Error: {error}</div>
            </div>
        );
    }

    return (
        <div className="attendance-container">
            <h2 className="attendance-title">Your Attendance Records</h2>
            <Link to="/visualization">
                <button className="visualize-button">Visualize Attendance</button>
            </Link>
            {attendanceData.length === 0 ? (
                <p>No attendance records found.</p>
            ) : (
                <table className="attendance-table">
                    <thead>
                        <tr>
                            <th>Attendance ID</th>
                            <th>Date</th>
                            <th>Shift Type</th>
                            <th>Hours Worked (Regular)</th>
                            <th>Overtime Hours</th>
                            <th>Leave Type</th>
                            <th>Attendance Rate</th>
                        </tr>
                    </thead>
                    <tbody>
                        {attendanceData.map((record, index) => (
                            <tr key={index}>
                                <td>{record.Attendance_ID}</td>
                                <td>{new Date(record.Date).toLocaleDateString()}</td>
                                <td>{record.Shift_Type}</td>
                                <td>{record.Hours_Worked_Regular}</td>
                                <td>{record.Overtime_Hours}</td>
                                <td>{record.Leave_Type}</td>
                                <td>{record.Attendance_Rate}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default ViewOwnAttendance;
