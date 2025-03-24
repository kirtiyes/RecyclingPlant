import React, { useEffect, useState } from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import axios from 'axios';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js';
import '../styles/VizAtt.css'

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

const VizAtt = () => {
    const [attendanceData, setAttendanceData] = useState([]);
    const [summarizedData, setSummarizedData] = useState([]);
    const [departmentData, setDepartmentData] = useState([]);
    const [leaveTypeData, setLeaveTypeData] = useState([]);

    useEffect(() => {
        const fetchEmployeeAttendance = async () => {
            const employeeId = localStorage.getItem('employeeId'); // Assuming Employee ID is stored in localStorage
            try {
                const response = await fetch(`http://localhost:5000/api/attendance/${employeeId}`);
                const data = await response.json();

                console.log('Attendance Data:', data); // Log the response data

                setAttendanceData(data.attendance);
                summarizeAttendance(data.attendance);
                summarizeLeaveTypeDistribution(data.attendance);
            } catch (error) {
                console.error('Error fetching attendance data:', error);
            }
        };

        const fetchDepartmentData = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/employee_attendance');
                const data = response.data;
                summarizeDepartmentAttendance(data);
            } catch (error) {
                console.error('Error fetching department data:', error);
            }
        };

        fetchEmployeeAttendance();
        fetchDepartmentData();
    }, []);

    const summarizeAttendance = (data) => {
        const summary = data.reduce((acc, record) => {
            const employeeId = record.Employee_ID;
            if (!acc[employeeId]) {
                acc[employeeId] = {
                    Employee_ID: employeeId,
                    Total_Hours_Worked: 0,
                    Total_Overtime_Hours: 0,
                    Attendance_Count: 0,
                    Not_Applicable_Count: 0,
                };
            }
            acc[employeeId].Total_Hours_Worked += record.Hours_Worked_Regular;
            acc[employeeId].Total_Overtime_Hours += record.Overtime_Hours;
            acc[employeeId].Attendance_Count += 1;
            if (record.Leave_Type === 'Not Applicable') {
                acc[employeeId].Not_Applicable_Count += 1;
            }
            return acc;
        }, {});

        const summarizedData = Object.values(summary).map(record => {
            const attendanceRate = (100 - (((record.Attendance_Count - record.Not_Applicable_Count) / record.Attendance_Count) * 100));
            return {
                Employee_ID: record.Employee_ID,
                Total_Hours_Worked: record.Total_Hours_Worked,
                Total_Overtime_Hours: record.Total_Overtime_Hours,
                Attendance_Rate: isNaN(attendanceRate) ? 0 : attendanceRate.toFixed(2),
            };
        });

        setSummarizedData(summarizedData);
    };

    const summarizeDepartmentAttendance = (data) => {
        const departmentSummary = data.reduce((acc, record) => {
            const deptId = record.Department_ID;
            if (!acc[deptId]) {
                acc[deptId] = {
                    Department_ID: deptId,
                    Total_Hours_Worked: 0,
                    Total_Overtime_Hours: 0,
                    Attendance_Count: 0,
                };
            }
            acc[deptId].Total_Hours_Worked += record.Hours_Worked_Regular;
            acc[deptId].Total_Overtime_Hours += record.Overtime_Hours;
            acc[deptId].Attendance_Count += 1;
            return acc;
        }, {});

        const departmentData = Object.values(departmentSummary).map(record => ({
            Department_ID: record.Department_ID,
            Avg_Hours_Worked: (record.Total_Hours_Worked / record.Attendance_Count).toFixed(2),
            Avg_Overtime_Hours: (record.Total_Overtime_Hours / record.Attendance_Count).toFixed(2),
        }));

        setDepartmentData(departmentData);
    };

    const summarizeLeaveTypeDistribution = (data) => {
        const leaveTypeSummary = data.reduce((acc, record) => {
            const leaveType = record.Leave_Type || 'Not Applicable';
            acc[leaveType] = (acc[leaveType] || 0) + 1;
            return acc;
        }, {});

        const leaveTypeData = Object.entries(leaveTypeSummary).map(([key, value]) => ({
            Leave_Type: key,
            Count: value,
        }));

        setLeaveTypeData(leaveTypeData);
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                ticks: {
                    fontSize: 10,
                },
            },
            y: {
                ticks: {
                    fontSize: 10,
                },
            },
        },
    };

    return (
        <div className='chart-container' style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '10px',
        }}>
            <div className='chart-1' style={{ height: '336px', marginTop: '36px' }}>
                <h3 style={{ fontSize: '14px', textAlign: 'center' }}>Total Hours Worked and Overtime</h3>
                <Bar data={{
                    labels: summarizedData.map(record => record.Employee_ID),
                    datasets: [
                        {
                            label: 'Total Hours Worked',
                            data: summarizedData.map(record => record.Total_Hours_Worked),
                            backgroundColor: 'rgba(75, 192, 192, 1)',
                        },
                        {
                            label: 'Total Overtime Hours',
                            data: summarizedData.map(record => record.Total_Overtime_Hours),
                            backgroundColor: 'rgba(153, 102, 255, 1)',
                        },
                        {
                            label: 'Attendance Rate (%)',
                            data: summarizedData.map(record => record.Attendance_Rate),
                            backgroundColor: 'rgba(255, 0, 0, 0.8)', // Darker color'rgba(255, 99, 132, 1)',
                        },
                    ],
                }} options={chartOptions} />
            </div>
            <div className='chart-2' style={{ height: '336px', marginTop: '36px' }}>
                <h3 style={{ fontSize: '14px', textAlign: 'center' }}>Individual Attendance Data</h3>
                <Bar data={{
                    labels: attendanceData.map(record => new Date(record.Date).toLocaleDateString()),
                    datasets: [
                        {
                            label: 'Hours Worked Regular',
                            data: attendanceData.map(record => record.Hours_Worked_Regular),
                            backgroundColor: 'rgba(75, 192, 192, 1)',
                        },
                        {
                            label: 'Overtime Hours',
                            data: attendanceData.map(record => record.Overtime_Hours),
                            backgroundColor: 'rgba(153, 102, 255, 1)',
                        },
                    ],
                }} options={chartOptions} />
            </div>
            <div className='chart-3' style={{ height: '336px', marginTop: '36px' }}>
                <h3 style={{ fontSize: '14px', textAlign: 'center' }}>Department Attendance Overview</h3>
                <Doughnut data={{
                    labels: departmentData.map(record => record.Department_ID),
                    datasets: [
                        {
                            label: 'Average Hours Worked',
                            data: departmentData.map(record => record.Avg_Hours_Worked),
                            backgroundColor: [
                                'rgba(255, 99, 132, 1)',
                                'rgba(54, 162, 235, 1)',
                                'rgba(255, 206, 86, 1)',
                                'rgba(75, 192, 192, 1)',
                                'rgba(153, 102, 255, 1)',
                                'rgba(255, 159, 64, 1)',
                            ],
                        },
                        {
                            label: 'Average Overtime Hours',
                            data: departmentData.map(record => record.Avg_Overtime_Hours),
                            backgroundColor: [
                                'rgba(255, 99, 132, 1)',
                                'rgba(54, 162, 235, 1)',
                                'rgba(255, 206, 86, 1)',
                                'rgba(75, 192, 192, 1)',
                                'rgba(153, 102, 255, 1)',
                                'rgba(255, 159, 64, 1)',
                            ],
                        },
                    ],
                }} options={chartOptions} />
            </div>
            <div className='chart-4' style={{ height: '336px', marginTop: '36px' }}>
                <h3 style={{ fontSize: '14px', textAlign: 'center' }}>Leave Type Distribution</h3>
                <Doughnut data={{
                    labels: leaveTypeData.map(record => record.Leave_Type),
                    datasets: [
                        {
                            label: 'Leave Type Distribution',
                            data: leaveTypeData.map(record => record.Count),
                            backgroundColor: [
                                'rgba(255, 0, 0, 0.8)', // Darker color
                                'rgba(54, 162, 235, 1)',
                                'rgba(255, 206, 86, 1)',
                                'rgba(75, 192, 192, 1)',
                                'rgba(153, 102, 255, 1)',
                                'rgba(255, 159, 64, 1)',
                            ],
                        },
                    ],
                }} options={chartOptions} />
            </div>
        </div>
    );
};

export default VizAtt;
