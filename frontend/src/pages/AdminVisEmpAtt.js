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

const AdminVisEmpAtt = () => {
    const [attendanceData, setAttendanceData] = useState([]);
    const [summarizedData, setSummarizedData] = useState([]);
    const [departmentData, setDepartmentData] = useState([]);
    const [leaveTypeData, setLeaveTypeData] = useState([]);
    const [totalLeavesByDepartment, setTotalLeavesByDepartment] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5000/api/employee_attendance')
            .then(response => {
                setAttendanceData(response.data);
                summarizeAttendance(response.data);
                summarizeDepartmentAttendance(response.data);
                summarizeLeaveTypeDistribution(response.data);
                summarizeTotalLeavesByDepartment(response.data);
            })
            .catch(error => {
                console.error('Error fetching attendance data:', error);
            });
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
        const leaveTypeByDept = data.reduce((acc, record) => {
            const deptId = record.Department_ID;
            const leaveType = record.Leave_Type || 'Not Applicable';
            if (!acc[deptId]) {
                acc[deptId] = {};
            }
            acc[deptId][leaveType] = (acc[deptId][leaveType] || 0) + 1;
            return acc;
        }, {});

        const leaveTypeData = Object.entries(leaveTypeByDept).map(([deptId, leaveTypes]) => ({
            Department_ID: deptId,
            Leave_Types: leaveTypes,
        }));

        setLeaveTypeData(leaveTypeData);
    };

    const summarizeTotalLeavesByDepartment = (data) => {
        const totalLeaves = data.reduce((acc, record) => {
            const deptId = record.Department_ID;
            if (record.Leave_Type && record.Leave_Type !== 'Not Applicable') {
                acc[deptId] = (acc[deptId] || 0) + 1;
            }
            return acc;
        }, {});

        const totalLeavesData = Object.entries(totalLeaves).map(([deptId, count]) => ({
            Department_ID: deptId,
            Total_Leaves: count,
        }));

        setTotalLeavesByDepartment(totalLeavesData);
    };

    const combinedLeaveTypeData = {
        labels: [],
        data: [],
        backgroundColor: [],
    };

    const chartData = {
        labels: departmentData.map(record => `Dept ${record.Department_ID}`),
        datasets: [
            {
                label: 'Avg Hours Worked',
                data: departmentData.map(record => record.Avg_Hours_Worked),
                backgroundColor: 'rgba(75, 192, 192, 1)',
            },
            {
                label: 'Avg Overtime Hours',
                data: departmentData.map(record => record.Avg_Overtime_Hours),
                backgroundColor: 'rgba(153, 102, 255, 1)',
            },
        ],
    };

    const summarizedChartData = {
        labels: summarizedData.map(record => `${record.Employee_ID}`),
        datasets: [
            {
                label: 'Total Hours Worked',
                data: summarizedData.map(record => record.Total_Hours_Worked),
                backgroundColor: 'rgba(255, 206, 86, 1)',
            },
            {
                label: 'Total Overtime Hours',
                data: summarizedData.map(record => record.Total_Overtime_Hours),
                backgroundColor: 'rgba(54, 162, 235, 1)',
            },
            {
                label: 'Attendance Rate (%)',
                data: summarizedData.map(record => parseFloat(record.Attendance_Rate)),
                backgroundColor: 'rgb(242, 106, 147)',
            },
        ],
    };

    const colors = [
        'rgba(255, 0, 0, 0.8)', //red
        'rgba(75, 192, 192, 1)', //teal
        'rgba(255, 159, 64, 1)', //orange
        'rgba(153, 102, 255, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(75, 192, 192, 1)',
    ];

    leaveTypeData.forEach((department, index) => {
        const deptColor = colors[index % colors.length];
        if (department.Leave_Types) {
            Object.entries(department.Leave_Types).forEach(([leaveType, count]) => {
                combinedLeaveTypeData.labels.push(`${leaveType.charAt(0)} - ${department.Department_ID}`);
                combinedLeaveTypeData.data.push(count);
                combinedLeaveTypeData.backgroundColor.push(deptColor);
            });
        }
    });

    const totalLeavesChartData = {
        labels: totalLeavesByDepartment.map(record => `Dept ${record.Department_ID}`),
        datasets: [
            {
                label: 'Total Leaves by Department',
                data: totalLeavesByDepartment.map(record => record.Total_Leaves),
                backgroundColor: colors.slice(0, totalLeavesByDepartment.length),
            },
        ],
    };

    return (
        <div className='admin-chart-container' style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '10px',
        }}>
            <div style={{ maxHeight: '336px', marginTop: '36px' }}>
                <h2 style={{ fontSize: '16px', textAlign: 'center' }}>Employee Attendance Visualization</h2>
                <Bar data={chartData} options={{ responsive: true, maintainAspectRatio: false }} height={50}/>
            </div>
            <div style={{ maxHeight: '336px', marginTop: '36px' }}>
                <h2 style={{ fontSize: '16px', textAlign: 'center' }}>Employee Attendance Summary</h2>
                <Bar data={summarizedChartData} options={{ responsive: true, maintainAspectRatio: false }} height={50} />
            </div>
            <div style={{ maxHeight: '336px', marginTop: '36px' }}>
                <h2 style={{ fontSize: '16px', textAlign: 'center' }}>Leave Type Comparison for Departments</h2>
                <Doughnut 
                    data={{
                        labels: combinedLeaveTypeData.labels,
                        datasets: [
                            {
                                data: combinedLeaveTypeData.data,
                                backgroundColor: combinedLeaveTypeData.backgroundColor,
                            },
                        ],
                    }}
                    options={{ responsive: true, maintainAspectRatio: false }} 
                    height={300} 
                />
            </div>
            <div style={{ maxHeight: '336px', marginTop: '36px' }}>
                <h2 style={{ fontSize: '16px', textAlign: 'center' }}>Total Leaves Comparison</h2>
                <Doughnut data={totalLeavesChartData} options={{ responsive: true, maintainAspectRatio: false }} height={300} />
            </div>
        </div>
    );
};

export default AdminVisEmpAtt;
