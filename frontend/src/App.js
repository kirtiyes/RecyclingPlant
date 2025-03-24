import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import ResetPassword from './components/ResetPassword';
import Profile from './pages/Profile';
import FloorPlan from './pages/FloorPlan';
import AdminDashboard from './pages/AdminDashboard';
import ManagerOperationsDashboard from './pages/ManagerOperationsDashboard';
import ManagerMaintenanceDashboard from './pages/ManagerMaintenanceDashboard';
import EmployeeOperationsDashboard from './pages/EmployeeOperationsDashboard';
import EmployeeMaintenanceDashboard from './pages/EmployeeMaintenanceDashboard';

// Import components for employee and department management
import AddEmployee from './pages/AddEmployee';
import RemoveEmployee from './pages/RemoveEmployee';
import AddDepartment from './pages/AddDepartment';
import AdminEmployees from './pages/AdminEmployees';
import EmployeeAttendance from './pages/EmployeeAttendance'; // Import your attendance component
import AddEmployeeAttendance from './pages/AddEmployeeAttendance'; // If you have this
import EditEmployeeAttendance from './pages/EditEmployeeAttendance'; // If you have this
import AdminVisEmpAtt from './pages/AdminVisEmpAtt';

import AdminDepartmentsView from './pages/AdminDepartmentsView';
import Layout from './components/Layout'; // Import the Layout component
import ViewOwnAttendance from './pages/ViewOwnAttendance';
import VizAtt from './pages/VizAtt';
import EditEmployee from './pages/EditEmployee'; // Import EditEmployee
import EditDepartment from './pages/EditDepartment';

import AddMachine from './pages/AddMachine';
import EditMachine from './pages/EditMachine';
import RemoveMachine from './pages/RemoveMachine';
import ViewMachines from './pages/ViewMachines'; // Component to view all machines

import ViewMaterials from './pages/ViewMaterials';
import AddMaterial from './pages/AddMaterial';
import EditMaterial from './pages/EditMaterial'; // Add the EditMaterial component

import ViewProcesses from './pages/ViewProcesses';
import AddProcess from './pages/AddProcess';
import EditProcess from './pages/EditProcess'; 

import ViewMaterialInventory from './pages/ViewMaterialInventory';
import AddMaterialInventory from './pages/AddMaterialInventory';
import EditMaterialInventory from './pages/EditMaterialInventory';

import ManagerMaintenanceViewEmp from './pages/ManagerMaintenanceViewEmp';
import ManagerMaintenanceEditEmp from './pages/ManagerMaintenanceEditEmp'; // Import EditEmployee
import ManagerViewDepartments from './pages/ManagerViewDepartments';
import ManagerMaintenanceViewMat from './pages/ManagerMaintenanceViewMat';
import ManagerMaintenanceViewPro from './pages/ManagerMaintenanceViewPro';
import ManagerMaintenanceViewMac from './pages/ManagerMaintenanceViewMac';
import ManagerMaintenanceEditMac from './pages/ManagerMaintenanceEditMac';
import ManagerMaintenanceViewMatInv from './pages/ManagerMaintenanceViewMatInv';
import ManagerMaintenanceEditMatInv from './pages/ManagerMaintenanceEditMatInv';
import ManagerMaintenanceAddMatInv from './pages/ManagerMaintenanceAddMatInv';
import ManagerMaintenanceViewEmpAtt from './pages/ManagerMaintenanceViewEmpAtt';
import ManagerMaintenanceEditEmpAtt from './pages/ManagerMaintenanceEditEmpAtt';
import ManagerMaintenanceVizEmpAtt from './pages/ManagerMaintenanceVizEmpAtt';

import ManagerOperationsViewEmp from './pages/ManagerOperationsViewEmp';
import ManagerOperationsEditEmp from './pages/ManagerOperationsEditEmp'; // Import EditEmployee
import ManagerOperationsViewPro from './pages/ManagerOperationsViewPro';
import ManagerOperationsViewMat from './pages/ManagerOperationsViewMat';
import ManagerOperationsEditMat from './pages/ManagerOperationsEditMat';
import ManagerOperationsAddMat from './pages/ManagerOperationsAddMat';
import ManagerOperationsViewMac from './pages/ManagerOperationsViewMac';
import ManagerOperationsEditMac from './pages/ManagerOperationsEditMac';
import ManagerOperationsViewMatInv from './pages/ManagerOperationsViewMatInv';
import ManagerOperationsEditMatInv from './pages/ManagerOperationsEditMatInv';
import ManagerOperationsViewEmpAtt from './pages/ManagerOperationsViewEmpAtt';
import ManagerOperationsEditEmpAtt from './pages/ManagerOperationsEditEmpAtt';
import ManagerOperationsVizEmpAtt from './pages/ManagerOperationsVizEmpAtt';

import EmployeeViewDepartments from './pages/EmployeeViewDepartments';
import EmployeeMaintenanceViewMac from './pages/EmployeeMaintenanceViewMac';
import EmployeeMaintenanceEditMac from './pages/EmployeeMaintenanceEditMac';
import EmployeeMaintenanceViewMatInv from './pages/EmployeeMaintenanceViewMatInv';
import EmployeeMaintenanceEditMatInv from './pages/EmployeeMaintenanceEditMatInv';

import EmployeeOperationsViewMac from './pages/EmployeeOperationsViewMac';
import EmployeeOperationsViewMat from './pages/EmployeeOperationsViewMat';
import EmployeeOperationsEditMat from './pages/EmployeeOperationsEditMat';
import EmployeeOperationsViewPro from './pages/EmployeeOperationsViewPro';
import EmployeeOperationsViewMatInv from './pages/EmployeeOperationsViewMatInv';
import EmployeeOperationsEditMatInv from './pages/EmployeeOperationsEditMatInv';

function App() {
    const [rooms, setRooms] = useState([]);

    // Fetch rooms data on component mount
    useEffect(() => {
        fetch('http://localhost:5000/api/floorplan')
            .then(response => response.json())
            .then(data => setRooms(data))
            .catch(error => console.error('Error fetching floor plan:', error));
    }, []);

    const role = localStorage.getItem('userRole'); // Retrieve the role from localStorage

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Layout />}>
                    {/* Main navigation routes */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route path="/profile" element={<Profile role={role}/>} />
                    <Route path="/visualization" element={<VizAtt />} />
                    <Route path="/floorplan" element={<FloorPlan rooms={rooms} />} />
                    <Route path="/view-attendance" element={<ViewOwnAttendance />} />
                    <Route path="/admin-dashboard" element={<AdminDashboard />} />
                    <Route path="/manager-operations-dashboard" element={<ManagerOperationsDashboard />} />
                    <Route path="/manager-maintenance-dashboard" element={<ManagerMaintenanceDashboard />} />
                    <Route path="/employee-operations-dashboard" element={<EmployeeOperationsDashboard />} />
                    <Route path="/employee-maintenance-dashboard" element={<EmployeeMaintenanceDashboard />} />

                    {/* Employee management routes */}
                    <Route path="/admin/employees/view" element={<AdminEmployees />} />
                    <Route path="/admin/employees/add" element={<AddEmployee />} />
                    <Route path="/admin/employees/remove" element={<RemoveEmployee />} />
                    <Route path="/admin/employees/edit/:id" element={<EditEmployee userRole="Admin"/>} /> {/* Add this route */}
                    <Route path="/admin/employee-attendance" element={<EmployeeAttendance />} />
                    <Route path="/admin/attendance/add" element={<AddEmployeeAttendance />} />
                    <Route path="/admin/attendance/edit/:attendanceId" element={<EditEmployeeAttendance />} />
                    <Route path="/admin/attendance/visualize" element={<AdminVisEmpAtt />} />

                    {/* Department management routes */}
                    <Route path="/admin/departments/view" element={<AdminDepartmentsView />} />
                    <Route path="/admin/departments/add" element={<AddDepartment />} />
                    <Route path="/admin/departments/edit/:id" element={<EditDepartment />} /> {/* Add this route */}

                    {/* Machine Routes */}
                    <Route path="/admin/machines/add" element={<AddMachine />} />
                    <Route path="/admin/machines/edit/:id" element={<EditMachine />} />
                    <Route path="/admin/machines/remove/:id" element={<RemoveMachine />} />
                    <Route path="/admin/machines/view" element={<ViewMachines />} />

                    <Route path="/admin/materials/view" element={<ViewMaterials />} />
                    <Route path="/admin/materials/add" element={<AddMaterial />} />
                    <Route path="/admin/materials/edit/:id" element={<EditMaterial />} /> {/* Add this route */} 

                    <Route path="/admin/processes/view" element={<ViewProcesses />} />
                    <Route path="/admin/processes/add" element={<AddProcess />} />
                    <Route path="/admin/processes/edit/:id" element={<EditProcess />} /> 

                    <Route path="/admin/material_inventory/view" element={<ViewMaterialInventory />} />
                    <Route path="/admin/material_inventory/add" element={<AddMaterialInventory />} />
                    <Route path="/admin/material_inventory/edit/:id" element={<EditMaterialInventory />} /> 

                    <Route path="/managermaintenance/employees/view" element={<ManagerMaintenanceViewEmp userRole="Manager-Maintenance"/>} />
                    <Route path="/managermaintenance/employees/edit/:id" element={<ManagerMaintenanceEditEmp userRole="Manager-Maintenance"/>} /> {/* Add this route */}
                    <Route path="/managermaintenance/departments" element={<ManagerViewDepartments />} />
                    <Route path="/managermaintenance/materials" element={<ManagerMaintenanceViewMat />} />
                    <Route path="/managermaintenance/processes" element={<ManagerMaintenanceViewPro />} />
                    <Route path="/managermaintenance/machines/view" element={<ManagerMaintenanceViewMac />} />
                    <Route path="/managermaintenance/machines/edit/:id" element={<ManagerMaintenanceEditMac userRole="Manager-Maintenance"/>} />
                    <Route path="/managermaintenance/material_inventory/view" element={<ManagerMaintenanceViewMatInv />} />
                    <Route path="/managermaintenance/material_inventory/edit/:id" element={<ManagerMaintenanceEditMatInv userRole="Manager-Maintenance"/>} />
                    <Route path="/managermaintenance/material_inventory/add" element={<ManagerMaintenanceAddMatInv />} />
                    <Route path="/managermaintenance/employee_attendance/view" element={<ManagerMaintenanceViewEmpAtt userRole="Manager-Maintenance"/>} />
                    <Route path="/managermaintenance/employee_attendance/edit/:attendanceId" element={<ManagerMaintenanceEditEmpAtt userRole="Manager-Maintenance"/>} />
                    <Route path="/managermaintenance/employee_attendance/viz" element={<ManagerMaintenanceVizEmpAtt userRole="Manager-Maintenance"/>} />

                    <Route path="/manageroperations/employees/view" element={<ManagerOperationsViewEmp userRole="Manager-Operations"/>} />
                    <Route path="/manageroperations/employees/edit/:id" element={<ManagerOperationsEditEmp userRole="Manager-Operations"/>} /> {/* Add this route */}
                    <Route path="/manageroperations/departments" element={<ManagerViewDepartments />} />
                    <Route path="/manageroperations/processes" element={<ManagerOperationsViewPro />} />
                    <Route path="/manageroperations/materials/view" element={<ManagerOperationsViewMat />} />
                    <Route path="/manageroperations/materials/edit/:id" element={<ManagerOperationsEditMat userRole="Manager-Operations"/>} />
                    <Route path="/manageroperations/materials/add" element={<ManagerOperationsAddMat />} />
                    <Route path="/manageroperations/machines/view" element={<ManagerOperationsViewMac />} />
                    <Route path="/manageroperations/machines/edit/:id" element={<ManagerOperationsEditMac userRole="Manager-Operations"/>} />
                    <Route path="/manageroperations/material-inventory/view" element={<ManagerOperationsViewMatInv />} />
                    <Route path="/manageroperations/material_inventory/edit/:id" element={<ManagerOperationsEditMatInv userRole="Manager-Operations"/>} />
                    <Route path="/manageroperations/employee_attendance/view" element={<ManagerOperationsViewEmpAtt userRole="Manager-Operations"/>} />
                    <Route path="/manageroperations/employee_attendance/edit/:attendanceId" element={<ManagerOperationsEditEmpAtt userRole="Manager-Operations"/>} />
                    <Route path="/manageroperations/employee_attendance/viz" element={<ManagerOperationsVizEmpAtt userRole="Manager-Operations"/>} />

                    <Route path="/employeemaintenance/departments" element={<EmployeeViewDepartments />} />
                    <Route path="/employeemaintenance/machines/view" element={<EmployeeMaintenanceViewMac />} />
                    <Route path="/employeemaintenance/machines/edit/:id" element={<EmployeeMaintenanceEditMac userRole="Employee-Maintenance"/>} />
                    <Route path="/employeemaintenance/material_inventory/view" element={<EmployeeMaintenanceViewMatInv />} />
                    <Route path="/employeemaintenance/material_inventory/edit/:id" element={<EmployeeMaintenanceEditMatInv userRole="Employee-Maintenance"/>} />

                    <Route path="/employeeoperations/departments" element={<EmployeeViewDepartments />} />
                    <Route path="/employeeoperations/machines/view" element={<EmployeeOperationsViewMac />} />
                    <Route path="/employeeoperations/materials/view" element={<EmployeeOperationsViewMat />} />
                    <Route path="/employeeoperations/materials/edit/:id" element={<EmployeeOperationsEditMat userRole="Employee-Operations"/>} />
                    <Route path="/employeeoperations/processes/view" element={<EmployeeOperationsViewPro />} />
                    <Route path="/employeeoperations/material_inventory/view" element={<EmployeeOperationsViewMatInv />} />
                    <Route path="/employeeoperations/material_inventory/edit/:id" element={<EmployeeOperationsEditMatInv userRole="Employee-Operations"/>} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
