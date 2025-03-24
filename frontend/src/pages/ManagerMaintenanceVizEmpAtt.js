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

const ManagerMaintenanceVizEmpAtt = () => {
    const [attendanceData, setAttendanceData] = useState([]);
    const [summarizedData, setSummarizedData] = useState([]);
    const [departmentData, setDepartmentData] = useState([]);
    const [leaveTypeData, setLeaveTypeData] = useState([]);
    const [totalLeavesByDepartment, setTotalLeavesByDepartment] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5000/api/employee_attendance')
            .then(response => {
                const filteredData = response.data.filter(record => record.Department_ID === 'D002');
                setAttendanceData(filteredData);
                summarizeAttendance(filteredData);
                summarizeDepartmentAttendance(filteredData);
                summarizeLeaveTypeDistribution(filteredData);
                summarizeTotalLeavesByDepartment(filteredData);
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
        const leaveTypeByEmp = data.reduce((acc, record) => {
            const empId = record.Employee_ID;
            const leaveType = record.Leave_Type || 'Not Applicable';
            if (!acc[empId]) {
                acc[empId] = {};
            }
            acc[empId][leaveType] = (acc[empId][leaveType] || 0) + 1;
            return acc;
        }, {});

        const leaveTypeData = Object.entries(leaveTypeByEmp).map(([empId, leaveTypes]) => ({
            Employee_ID: empId,
            Leave_Types: leaveTypes,
        }));

        setLeaveTypeData(leaveTypeData);
    };

    const summarizeTotalLeavesByDepartment = (data) => {
        const totalLeaves = data.reduce((acc, record) => {
            const empId = record.Employee_ID;
            if (record.Leave_Type && record.Leave_Type !== 'Not Applicable') {
                acc[empId] = (acc[empId] || 0) + 1;
            }
            return acc;
        }, {});

        const totalLeavesData = Object.entries(totalLeaves).map(([empId, count]) => ({
            Employee_ID: empId,
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
                backgroundColor: 'rgba(255, 159, 64, 1)',
            },
            {
                label: 'Total Overtime Hours',
                data: summarizedData.map(record => record.Total_Overtime_Hours),
                backgroundColor: 'rgba(54, 162, 235, 1)',
            },
            {
                label: 'Attendance Rate (%)',
                data: summarizedData.map(record => parseFloat(record.Attendance_Rate)),
                backgroundColor: 'rgba(255, 99, 132, 1)',
            },
        ],
    };

    const colors = [
        'rgba(255, 0, 0, 0.8)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
    ];

    leaveTypeData.forEach((employee, index) => {
        const empColor = colors[index % colors.length];
        if (employee.Leave_Types) {
            Object.entries(employee.Leave_Types).forEach(([leaveType, count]) => {
                combinedLeaveTypeData.labels.push(`${leaveType} - ${employee.Employee_ID}`);
                combinedLeaveTypeData.data.push(count);
                combinedLeaveTypeData.backgroundColor.push(empColor);
            });
        }
    });

    const totalLeavesChartData = {
        labels: totalLeavesByDepartment.map(record => `Employee ${record.Employee_ID}`), // Use Employee_ID as label
        datasets: [
            {
                label: 'Total Leaves Taken',
                data: totalLeavesByDepartment.map(record => record.Total_Leaves),
                backgroundColor: colors.slice(0, totalLeavesByDepartment.length),
            },
        ],
    };

    return (
        <div className='admin-chart-container' style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '5px',
            
        }}>
            <div style={{ maxHeight: '336px', marginTop: '36px', marginLeft: '10px' }}>
                <h2 style={{ fontSize: '16px', textAlign: 'center' }}>Employee Working Hours and Overtime by Date</h2>
                <Bar
                    data={{
                        labels: attendanceData.map(record => `${record.Employee_ID}:${new Date(record.Date).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' })}`),
                        datasets: [
                            {
                                label: 'Total Hours Worked',
                                data: attendanceData.map(record => record.Hours_Worked_Regular),
                                backgroundColor: 'rgba(75, 192, 192, 1)',
                            },
                            {
                                label: 'Overtime Hours',
                                data: attendanceData.map(record => record.Overtime_Hours),
                                backgroundColor: 'rgba(255, 159, 64, 1)',
                            },
                        ],
                    }}
                    options={{ responsive: true, maintainAspectRatio: false }}
                    height={50}
                />
            </div>

            <div style={{ maxHeight: '336px', marginTop: '36px', marginLeft: '30px' }}>
                <h2 style={{ fontSize: '16px', textAlign: 'center' }}>Employee Attendance Summary</h2>
                <Bar
                    data={summarizedChartData}
                    options={{ responsive: true, maintainAspectRatio: false }}
                    height={50}
                />
            </div>

            <div style={{ maxHeight: '336px', marginTop: '36px', marginLeft: '3px' }}>
                <h2 style={{ fontSize: '16px', textAlign: 'center' }}>Leave Type Distribution</h2>
                <Doughnut
                    data={{
                        labels: combinedLeaveTypeData.labels,
                        datasets: [{
                            data: combinedLeaveTypeData.data,
                            backgroundColor: combinedLeaveTypeData.backgroundColor,
                        }],
                    }}
                    options={{ responsive: true, maintainAspectRatio: false }}
                    height={50}
                />
            </div>

            <div style={{ maxHeight: '336px', marginTop: '36px', marginLeft: '-23px' }}>
                <h2 style={{ fontSize: '16px', textAlign: 'center' }}>Total Leaves Taken by Employee</h2> {/* Updated title */}
                <Doughnut
                    data={totalLeavesChartData}
                    options={{ responsive: true, maintainAspectRatio: false }}
                    height={50}
                />
            </div>
        </div>
    );
};

export default ManagerMaintenanceVizEmpAtt;
