import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../styles/ManMainEditAtt.css'

const ManagerMaintenanceEditEmpAtt = ({ userRole }) => {
    const { attendanceId } = useParams();
    const [attendance, setAttendance] = useState({
        Employee_ID: '',
        Employee_Role: '',
        Department_ID: '',
        Date: '',
        Shift_Type: '',
        Hours_Worked_Regular: '',
        Overtime_Hours: '',
        Leave_Type: '',
    });
    const [employeeDetails, setEmployeeDetails] = useState({});
    const [attendanceRate, setAttendanceRate] = useState(null);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchAttendance = async () => {
            if (attendanceId) {
                try {
                    const response = await axios.get(`http://localhost:5000/api/employee_attendance/${attendanceId}`);
                    if (response.data && response.data.length > 0) {
                        setAttendance(response.data[0]); // Access the first object in the array
                    } else {
                        setMessage('No attendance data found.');
                    }
                } catch (error) {
                    console.error('Error fetching attendance data:', error);
                    setMessage('Error fetching attendance data: ' + (error.response ? error.response.data : error.message));
                }
            } else {
                console.error('Attendance ID is undefined.');
            }
        };

        fetchAttendance();
    }, [attendanceId]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`http://localhost:5000/api/employee_attendance/${attendanceId}`, attendance);
            if (response.data.success) {
                setMessage('Attendance updated successfully.');
            } else {
                setMessage('Failed to update attendance.');
            }
        } catch (error) {
            console.error('Error updating attendance:', error);
            setMessage('Error updating attendance.');
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setAttendance((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    return (
        <div className='edit-manmainatt-wrapper'>
        <div className='edit-manmainatt-container'>
            <h2 style={{ textAlign: 'center' }}>Edit Attendance</h2>
            {attendance ? (
                <form onSubmit={handleUpdate}>
                    <table style={{ margin: '0 auto', width: '50%', borderCollapse: 'collapse' }}>
                        <tbody>
                            <tr>
                                <td>
                                    <label htmlFor="Attendance_ID">Attendance ID:</label>
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        id="Attendance_ID"
                                        name="Attendance_ID"
                                        value={attendance.Attendance_ID}
                                        onChange={handleChange}
                                        disabled
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <label htmlFor="Employee_ID">Employee ID:</label>
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        id="Employee_ID"
                                        name="Employee_ID"
                                        value={attendance.Employee_ID}
                                        onChange={handleChange}
                                        disabled
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <label htmlFor="Employee_Role">Employee Role:</label>
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        id="Employee_Role"
                                        name="Employee_Role"
                                        value={attendance.Employee_Role}
                                        onChange={handleChange}
                                        disabled
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <label htmlFor="Department_ID">Department ID:</label>
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        id="Department_ID"
                                        name="Department_ID"
                                        value={attendance.Department_ID}
                                        onChange={handleChange}
                                        disabled
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <label htmlFor="Date">Date:</label>
                                </td>
                                <td>
                                    <input
                                        type="date"
                                        id="Date"
                                        name="Date"
                                        value={attendance.Date ? new Date(attendance.Date).toISOString().split('T')[0] : ''}
                                        onChange={handleChange}
                                        required
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <label htmlFor="Shift_Type">Shift Type:</label>
                                </td>
                                <td>
                                    <select
                                        id="Shift_Type"
                                        name="Shift_Type"
                                        value={attendance.Shift_Type}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Select Shift Type</option>
                                        <option value="Morning">Morning</option>
                                        <option value="Evening">Evening</option>
                                        <option value="Night">Night</option>
                                    </select>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <label htmlFor="Hours_Worked_Regular">Hours Worked (Regular):</label>
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        id="Hours_Worked_Regular"
                                        name="Hours_Worked_Regular"
                                        value={attendance.Hours_Worked_Regular}
                                        onChange={handleChange}
                                        required
                                        min="0"
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <label htmlFor="Overtime_Hours">Overtime Hours:</label>
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        id="Overtime_Hours"
                                        name="Overtime_Hours"
                                        value={attendance.Overtime_Hours}
                                        onChange={handleChange}
                                        required
                                        min="0"
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <label htmlFor="Leave_Type">Leave Type:</label>
                                </td>
                                <td>
                                    <select
                                        id="Leave_Type"
                                        name="Leave_Type"
                                        value={attendance.Leave_Type}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Select Leave Type</option>
                                        <option value="Not Applicable">Not Applicable</option>
                                        <option value="Sick">Sick Leave</option>
                                        <option value="Casual">Casual Leave</option>
                                        <option value="Annual">Annual Leave</option>
                                        <option value="Unpaid">Unpaid Leave</option>
                                    </select>
                                </td>
                            </tr>
                            <tr>
                                <td colSpan="2" style={{ textAlign: 'center' }}>
                                    <button type="submit" style={{ padding: '10px 20px', marginBottom: '20px', marginTop: '20px' }}>Update Attendance</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </form>
            ) : (
                <p>Loading attendance data...</p>
            )}
            {message && <p style={{ textAlign: 'center' }}>{message}</p>}
        </div>
        </div>
    );
};

export default ManagerMaintenanceEditEmpAtt;
