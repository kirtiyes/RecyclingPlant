import React, { useState } from 'react';
import axios from 'axios';
import '../styles/AdminAddAttendance.css'

const AddEmployeeAttendance = () => {
    const [attendance, setAttendance] = useState({
        Attendance_ID: '',
        Employee_ID: '',
        Date: '',
        Shift_Type: '',
        Hours_Worked_Regular: '',
        Overtime_Hours: '',
        Leave_Type: '',
    });
    const [employeeDetails, setEmployeeDetails] = useState({});
    const [attendanceRate, setAttendanceRate] = useState(null);
    const [message, setMessage] = useState('');

    const handleChange = (event) => {
        const { name, value } = event.target;
        setAttendance((prevState) => ({
            ...prevState,
            [name]: value,
        }));

        // Fetch employee details if Employee_ID changes
        if (name === 'Employee_ID') {
            fetchEmployeeDetails(value);
        }
    };

    const fetchEmployeeDetails = async (employeeId) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/employees/${employeeId}`);
            setEmployeeDetails(response.data);
            // Fetch attendance records for attendance rate calculation
            setMessage('Employee details:');
            calculateAttendanceRate(employeeId);
        } catch (error) {
            console.error('Error fetching employee details:', error);
            setMessage('Error fetching employee details.');
        }
    };

    const calculateAttendanceRate = async (employeeId) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/employee_attendance/employee/${employeeId}`);
            const records = response.data;
            const totalRecords = records.length;
            const notApplicableCount = records.filter(record => record.Leave_Type === 'Not Applicable').length;

            const rate = totalRecords > 0 ? ((notApplicableCount / totalRecords) * 100).toFixed(2) : 0;
            setAttendanceRate(rate);
        } catch (error) {
            console.error('Error calculating attendance rate:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/employee_attendance', attendance);
            if (response.data.success) {
                setMessage('Attendance added successfully.');
                // Reset form if needed
                setAttendance({
                    Attendance_ID: '',
                    Employee_ID: '',
                    Date: '',
                    Shift_Type: '',
                    Hours_Worked_Regular: '',
                    Overtime_Hours: '',
                    Leave_Type: '',
                });
                setEmployeeDetails({});
                setAttendanceRate(null); // Reset attendance rate
            } else {
                setMessage('Failed to add attendance.');
            }
        } catch (error) {
            console.error('Error adding attendance:', error);
            setMessage('Error adding attendance.');
        }
    };

    return (
        <div className='add-attendance-wrapper'>
        <div className='add-attendance-container'>
            <h2 style={{ textAlign: 'center' }}>Add Attendance Record</h2>
            <form onSubmit={handleSubmit}>
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
                                    required
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
                                    required
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
                                    value={attendance.Date}
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
                                    <option value="Unpaid">Unpaid Leave</option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan="2" style={{ textAlign: 'center' }}>
                                <button type="submit" style={{ padding: '10px 20px', marginBottom: '20px', marginTop: '20px' }}>Add Attendance</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </form>
            {message && <p style={{ textAlign: 'center' }}>{message}</p>}
            {employeeDetails.Employee_Role && (
                <p style={{ textAlign: 'center' }}>Employee Role: {employeeDetails.Employee_Role}</p>
            )}
            {employeeDetails.Department_ID && (
                <p style={{ textAlign: 'center' }}>Department ID: {employeeDetails.Department_ID}</p>
            )}
            {attendanceRate !== null && ( // Display attendance rate
            <p style={{ textAlign: 'center' }}>Attendance Rate: {attendanceRate}%</p>
            )}
        </div>
        </div>
    );
};

export default AddEmployeeAttendance;
