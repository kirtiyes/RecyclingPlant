import React, { useEffect, useState } from 'react';
import '../styles/FloorPlan.css'; // Assuming your CSS is in the src/styles folder
import plant from '../assets/plant.png';
import plant2 from '../assets/plant2.png';
import plant3 from '../assets/plant3.png';
import herb from '../assets/herb.png';
import sofa from '../assets/sofa.png';
import machineIcon from '../assets/machine.png';
import user from '../assets/user.png';
import storage from '../assets/storage.png';
import coffeemachine from '../assets/coffee-machine.png';

const FloorPlan = () => {
    const [rooms, setRooms] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [departments, setDepartments] = useState([]);
    const [machines, setMachines] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [selectedMachine, setSelectedMachine] = useState(null); // For selected machine
    const [selectedEmployee, setSelectedEmployee] = useState(null); // For selected employee

    useEffect(() => {
        // Fetch the floor plan data from the API
        fetch('http://localhost:5000/api/floorplan')
            .then(response => response.json())
            .then(data => setRooms(data))
            .catch(error => console.error('Error fetching floor plan:', error));
    
        // Fetch department data from the API
        fetch('http://localhost:5000/api/departments')
            .then(response => response.json())
            .then(data => setDepartments(data))
            .catch(error => console.error('Error fetching department data:', error));
    
        // Fetch machines data from the API
        fetch('http://localhost:5000/api/machines')
            .then(response => response.json())
            .then(data => setMachines(data))
            .catch(error => console.error('Error fetching machine data:', error));
    
        // Fetch employees data from the API
        fetch('http://localhost:5000/api/employees')
            .then(response => response.json())
            .then(data => setEmployees(data))
            .catch(error => console.error('Error fetching employee data:', error));
    }, []);    

    const handleRoomClick = (room) => {
        setSelectedRoom(room);
    };

    const handleMachineClick = (machine) => {
        setSelectedMachine(machine);
        setSelectedRoom(null); // Clear the selected room
        setSelectedEmployee(null); // Clear the selected employee
    };
    
    const handleEmployeeClick = (employee) => {
        setSelectedEmployee(employee);
        setSelectedRoom(null); // Clear the selected room
        setSelectedMachine(null); // Clear the selected machine
    };

    // Function to create doors dynamically based on room positions
    const createDoors = (room) => {
        switch (room.Room_Name) {
            /*case 'Material Processing Room':
                return <line x1={room.x + 90} y1={room.y + 220} x2={room.x + 130} y2={room.y + 220} stroke="white" strokeWidth="3" />;*/
            case 'Recycling Conversion Room':
                return <line x1={room.x} y1={room.y + 90} x2={room.x} y2={room.y + 130} stroke="white" strokeWidth="3" />;
            case 'Administrative Office':
                return [
                    <line key="door1" x1={room.x + 110} y1={room.y + 120} x2={room.x + 150} y2={room.y + 120} stroke="white" strokeWidth="3" />,
                    <line key="door2" x1={room.x} y1={room.y + 60} x2={room.x} y2={room.y + 100} stroke="white" strokeWidth="8" />
                ];
            case 'Storage Room':
                return [
                    <line key="door1" x1={room.x + 160} y1={room.y + 300} x2={room.x + 200} y2={room.y + 300} stroke="white" strokeWidth="3" />,
                    <line key="door2" x1={room.x} y1={room.y + 180} x2={room.x} y2={room.y + 220} stroke="white" strokeWidth="3" />
                ];
            case 'Cafeteria':
                return <line x1={room.x} y1={room.y + 60} x2={room.x} y2={room.y + 100} stroke="white" strokeWidth="3" />;
            case 'Operations Team':
                return [
                    <line key="door1" x1={room.x + 80} y1={room.y} x2={room.x + 120} y2={room.y} stroke="white" strokeWidth="3" />,
                    <line key="door2" x1={room.x} y1={room.y + 60} x2={room.x} y2={room.y + 100} stroke="white" strokeWidth="3" />
                ];
            case 'Maintenance Team':
                return <line x1={room.x + 70} y1={room.y} x2={room.x + 110} y2={room.y} stroke="white" strokeWidth="3" />;
            default:
                return null; // No door for other rooms
        }
    };

    // Function to create machines dynamically based on Machine_Count
    const createMachines = (room) => {
        const roomMachines = machines.filter(machine => machine.Room_ID === room.Room_ID);
        const machineIcons = [];
    
        roomMachines.forEach((machine, index) => {
            machineIcons.push(
                <image
                    key={`machine-${index}`}
                    href={machineIcon}
                    x={room.x + 5 + index * 35} // Positioning each machine with some spacing
                    y={room.y + 10}
                    width="30"
                    height="30"
                    onClick={() => handleMachineClick(machine)} // Set machine info on click
                />
            );
        });
    
        return machineIcons;
    };    

    const createEmployees = (room) => {
        const department = departments.find(dep => dep.Room_ID === room.Room_ID);
        if (department) {
            const departmentEmployees = employees.filter(emp => emp.Department_ID === department.Department_ID);
            const employeeIcons = [];
            
            departmentEmployees.forEach((employee, index) => {
                employeeIcons.push(
                    <image
                        key={`employee-${index}`}
                        href={user} // Path to employee icon
                        x={room.x + 8 + index * 35}
                        y={room.y + 10}
                        width="30"
                        height="30"
                        onClick={() => handleEmployeeClick(employee)} // Set employee info on click
                    />
                );
            });
    
            return employeeIcons;
        }
        return null;
    };    

    return (
        <div className="floorplan-baclground">
        <div className="floorplan-container">
            <div className="floorplan">
                <svg width="900" height="550" className="floorplan-svg">
                    {/* Create the rooms */}
                    {rooms.map(room => (
                        <g key={room.Room_ID}>
                            <rect
                                x={room.x}
                                y={room.y}
                                width={room.Dimensions.split(' x ')[0].replace('m', '') * 10} // Scale width (10px per meter)
                                height={room.Dimensions.split(' x ')[1].replace('m', '') * 10} // Scale height (10px per meter)
                                className="room"
                                onClick={() => handleRoomClick(room)}
                            />
                            <text
                                x={room.x + room.Dimensions.split(' x ')[0].replace('m', '') * 5} // Center text horizontally
                                y={room.y + room.Dimensions.split(' x ')[1].replace('m', '') * 5} // Center text vertically
                                fill="#000" // Text color
                                fontSize="12"
                                className="room-label"
                                textAnchor="middle"
                                dominantBaseline="middle"
                            >
                                {room.Room_Name}
                            </text>

                            {/* Add plant image next to specific rooms */}
                            {room.Room_Name === 'Maintenance Team' && (
                                <image
                                    href={plant}
                                    x={room.x + 10}
                                    y={room.y + 120}
                                    width="40"
                                    height="40"
                                />
                            )}
                            {room.Room_Name === 'Storage Room' && (
                                <image
                                    href={plant2}
                                    x={room.x + 80}
                                    y={room.y}
                                    width="40"
                                    height="40"
                                />
                            )}
                            {room.Room_Name === 'Storage Room' && (
                                <image
                                    href={sofa}
                                    x={room.x + 240}
                                    y={room.y + 10}
                                    width="40"
                                    height="40"
                                />
                            )}
                            {room.Room_Name === 'Cafeteria' && (
                                <image
                                    href={coffeemachine}
                                    x={room.x + 5}
                                    y={room.y + 75}
                                    width="35"
                                    height="40"
                                />
                            )}
                            {room.Room_Name === 'Storage Room' && (
                                <image
                                    href={plant3}
                                    x={room.x + 5}
                                    y={room.y + 250}
                                    width="35"
                                    height="40"
                                />
                            )}
                            {room.Room_Name === 'Material Processing Room' && (
                                <image
                                    href={herb}
                                    x={room.x + 175}
                                    y={room.y + 200}
                                    width="40"
                                    height="40"
                                />
                            )}
                            {room.Room_Name === 'Storage Room' && (
                                <image
                                    href={storage}
                                    x={room.x + 240}
                                    y={room.y + 240}
                                    width="50"
                                    height="50"
                                />
                            )}

                            {/* Add doors based on room name */}
                            {createDoors(room)}

                            {/* Add machines dynamically */}
                            {createMachines(room)}

                            {createEmployees(room)}
                        </g>
                    ))}
                </svg>
                
                {/* Room Info */}
                <div className="room-info">
                {selectedRoom ? (
                    <>
                        <h2>{selectedRoom.Room_Name}</h2>
                        <p><strong>Department ID:</strong> {selectedRoom.Department_ID}</p>
                        <p><strong>Capacity:</strong> {selectedRoom.Capacity}</p>
                        <p><strong>Dimensions:</strong> {selectedRoom.Dimensions}</p>
                        <p><strong>Machine Count:</strong> {selectedRoom.Machine_Count}</p>
                        <p><strong>Description:</strong> {selectedRoom.Description}</p>
                    </>
                ) : selectedMachine ? (
                    <>
                        <h2>{selectedMachine.Machine_ID}</h2>
                        <p><strong>Machine Type:</strong> {selectedMachine.Machine_Type}</p>
                        <p><strong>Room ID:</strong> {selectedMachine.Room_ID}</p>
                        <p><strong>Status:</strong> {selectedMachine.Status}</p>
                        <p><strong>Last Maintenance Date:</strong> {new Date(selectedMachine.Last_Maintenance_Date).toLocaleDateString()}</p>
                        <p><strong>Next Scheduled Maintenance:</strong> {new Date(selectedMachine.Next_Scheduled_Maintenance).toLocaleDateString()}</p>
                        <p><strong>Assigned EmployeeID:</strong> {selectedMachine.Assigned_EmployeeID}</p>
                    </>
                ) : selectedEmployee ? (
                    <>
                        <h2>{selectedEmployee.Employee_ID}</h2>
                        <p><strong>Employee Name:</strong> {selectedEmployee.Employee_Name}</p>
                        <p><strong>Employee Role:</strong> {selectedEmployee.Employee_Role}</p>
                        <p><strong>Department ID:</strong> {selectedEmployee.Department_ID}</p> 
                        <p><strong>Date_of_Joining:</strong> {new Date(selectedEmployee.Date_of_Joining).toLocaleDateString()}</p>
                        <p><strong>Contact_Details:</strong> {selectedEmployee.Contact_Details}</p>
                    </>
                ) : (
                    <p>Select a room, machine, or employee to see details.</p>
                )}
            </div>
            </div>
        </div>
        </div>
    );
};

export default FloorPlan;
