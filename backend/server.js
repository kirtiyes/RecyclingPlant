const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');
const dotenv = require('dotenv');
const crypto = require('crypto'); // Import crypto for hashing

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.json());

app.use(cors());
app.use(bodyParser.json());

// MySQL connection
let db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL Database');
});

const createDbConnection = (user, password) => {
    return mysql.createConnection({
        host: process.env.DB_HOST,
        user: user,
        password: password,
        database: process.env.DB_NAME,
    });
};

const calculateAttendanceRate = (employeeId) => {
    return new Promise((resolve, reject) => {
        const countQuery = `
            SELECT 
                COUNT(*) AS totalRecords,
                SUM(CASE WHEN Leave_Type = 'Not Applicable' THEN 1 ELSE 0 END) AS notApplicableCount
            FROM employee_attendance
            WHERE Employee_ID = ?;
        `;

        db.query(countQuery, [employeeId], (err, results) => {
            if (err) {
                console.error('Error calculating attendance rate:', err);
                return reject(err);
            }

            // Log the result for debugging
            console.log('Attendance calculation results:', results);

            const totalRecords = results[0].totalRecords || 0;
            const notApplicableCount = results[0].notApplicableCount || 0;

            let attendanceRate = 0;
            if (totalRecords > 0) {
                attendanceRate = (notApplicableCount / totalRecords) * 100; // Calculate percentage
            }

            resolve(attendanceRate.toFixed(2)); // Return the attendance rate rounded to two decimal places
        });
    });
};

// Sample route
app.get('/', (req, res) => {
    res.send('Welcome to the Recycling Plant API');
});

// Login route
app.post('/api/login', (req, res) => {
    const { Employee_ID, Password } = req.body;
    const hashedPassword = crypto.createHash('sha256').update(Password).digest('hex');
    const query = 'SELECT * FROM Employee WHERE Employee_ID = ? AND Password = ?';

    db.query(query, [Employee_ID, hashedPassword], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ success: false, message: 'Database error.', error: err });
        }

        if (results.length > 0) {
            const role = results[0].Employee_Role;

            // If the role is 'Admin', create a new MySQL connection with admin credentials
            if (role === 'Admin') {
                /*const adminDb = createDbConnection(process.env.ADMIN_DB_USER, process.env.ADMIN_DB_PASSWORD);
                adminDb.connect((err) => {*/
                db = createDbConnection(process.env.ADMIN_DB_USER, process.env.ADMIN_DB_PASSWORD);
                db.connect((err) => {
                    if (err) {
                        console.error('Database connection error with admin user:', err);
                        return res.status(500).json({ success: false, message: 'Could not connect as admin user.' });
                    }
                    console.log('Connected to MySQL Database with admin user');
                    return res.json({ success: true, role, message: 'Admin login successful!' });
                });
            } 
            // If the role is 'Manager-Maintenance'
            else if (role === 'Manager-Maintenance') {
                // Create a new connection for the manager maintenance role
                /*const managerMaintenanceDb = createDbConnection(process.env.MANAGER_MAINTENANCE_DB_USER, process.env.MANAGER_MAINTENANCE_DB_PASSWORD);
                managerMaintenanceDb.connect((err) => {*/
                db = createDbConnection(process.env.MANAGER_MAINTENANCE_DB_USER, process.env.MANAGER_MAINTENANCE_DB_PASSWORD);
                db.connect((err) => {
                    if (err) {
                        console.error('Database connection error with manager maintenance user:', err);
                        return res.status(500).json({ success: false, message: 'Could not connect as manager maintenance user.' });
                    }
                    console.log('Connected to MySQL Database with manager maintenance user');
                    return res.json({ success: true, role, message: 'Manager-Maintenance login successful!' });
                });
            } 
            // If the role is 'Manager-Operations'
            else if (role === 'Manager-Operations') {
                // Create a new connection for the manager operations role
                /*const managerOperationsDb = createDbConnection(process.env.MANAGER_OPERATIONS_DB_USER, process.env.MANAGER_OPERATIONS_DB_PASSWORD);
                managerOperationsDb.connect((err) => {*/
                db = createDbConnection(process.env.MANAGER_OPERATIONS_DB_USER, process.env.MANAGER_OPERATIONS_DB_PASSWORD);
                db.connect((err) => {
                    if (err) {
                        console.error('Database connection error with manager operations user:', err);
                        return res.status(500).json({ success: false, message: 'Could not connect as manager operations user.' });
                    }
                    console.log('Connected to MySQL Database with manager operations user');
                    return res.json({ success: true, role, message: 'Manager-Operations login successful!' });
                });
            } 
            // If the role is 'Employee-Maintenance'
            else if (role === 'Employee-Maintenance') {
                /*const employeeMaintenanceDb = createDbConnection(process.env.EMPLOYEE_MAINTENANCE_DB_USER, process.env.EMPLOYEE_MAINTENANCE_DB_PASSWORD);
                employeeMaintenanceDb.connect((err) => {*/
                db = createDbConnection(process.env.EMPLOYEE_MAINTENANCE_DB_USER, process.env.EMPLOYEE_MAINTENANCE_DB_PASSWORD);
                db.connect((err) => {
                    if (err) {
                        console.error('Database connection error with employee maintenance user:', err);
                        return res.status(500).json({ success: false, message: 'Could not connect as employee maintenance user.' });
                    }
                    console.log('Connected to MySQL Database with employee maintenance user');
                    return res.json({ success: true, role, message: 'Employee-Maintenance login successful!' });
                });
            }
            // If the role is 'Employee-Operations'
            else if (role === 'Employee-Operations') {
                /*const employeeOperationsDb = createDbConnection(process.env.EMPLOYEE_OPERATIONS_DB_USER, process.env.EMPLOYEE_OPERATIONS_DB_PASSWORD);*/
                db = createDbConnection(process.env.EMPLOYEE_OPERATIONS_DB_USER, process.env.EMPLOYEE_OPERATIONS_DB_PASSWORD);
                /*employeeOperationsDb.connect((err) => {*/
                db.connect((err) => {
                    if (err) {
                        console.error('Database connection error with employee operations user:', err);
                        return res.status(500).json({ success: false, message: 'Could not connect as employee operations user.' });
                    }
                    console.log('Connected to MySQL Database with employee operations user');
                    return res.json({ success: true, role, message: 'Employee-Operations login successful!' });
                });
            } 
            else {
                return res.json({ success: true, role });
            }
        } else {
            return res.json({ success: false, message: 'Invalid credentials' });
        }
    });
});

app.post('/api/logout', (req, res) => {
    if (db) {
        // Close the existing connection
        db.end(err => {
            if (err) {
                console.error('Error closing database connection:', err);
                return res.status(500).json({ success: false, message: 'Error closing the database connection.' });
            }

            console.log('Database connection closed.');

            // Reconnect after closing
            db = mysql.createConnection({
                host: process.env.DB_HOST,
                user: process.env.DB_USER, // Admin or default credentials
                password: process.env.DB_PASSWORD,
                database: process.env.DB_NAME,
            });

            db.connect(err => {
                if (err) {
                    console.error('Error reconnecting to the database:', err);
                    return res.status(500).json({ success: false, message: 'Error reconnecting to the database.' });
                }

                console.log('Reconnected to MySQL database with default credentials');
                res.json({ success: true, message: 'Logged out, connection closed, and reconnected.' });
            });
        });
    } else {
        // No active connection, but still reconnect
        db = mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER, // Admin or default credentials
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        });

        db.connect(err => {
            if (err) {
                console.error('Error reconnecting to the database:', err);
                return res.status(500).json({ success: false, message: 'Error reconnecting to the database.' });
            }

            console.log('Reconnected to MySQL database with default credentials');
            res.json({ success: true, message: 'Logged out, no active connection to close, but reconnected.' });
        });
    }
});

app.post('/api/reset-password', (req, res) => {
    const { Employee_ID, Department_ID, New_Password } = req.body;

    console.log('Received payload:', req.body); // Log received payload

    // Check if the employee exists and retrieve their role using Employee_ID and Department_ID
    db.query('SELECT Employee_Role FROM Employee WHERE Employee_ID = ? AND Department_ID = ?', [Employee_ID.trim(), Department_ID.trim()], (err, employee) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ success: false, message: 'Database error.', error: err });
        }

        if (!employee.length) {
            console.log('Invalid Employee ID or Department ID'); // Log invalid input
            return res.status(400).json({ success: false, message: 'Invalid Employee ID or Department ID' });
        }

        // Get the role of the employee being updated
        const employeeRole = employee[0].Employee_Role;

        // Hash the new password
        const hashedPassword = crypto.createHash('sha256').update(New_Password).digest('hex');

        let updateQuery;

        // Determine the update query based on the role of the employee being updated
        switch (employeeRole) {
            case 'Admin':
                updateQuery = 'UPDATE Employee SET Password = ? WHERE Employee_ID = ?';
                break;
            case 'Manager-Maintenance':
                updateQuery = 'UPDATE manager_maintenance_own_employee_view SET Password = ? WHERE Employee_ID = ?';
                break;
            case 'Manager-Operations':
                updateQuery = 'UPDATE operations_manager_own_employee_view SET Password = ? WHERE Employee_ID = ?';
                break;
            case 'Employee-Maintenance':
            case 'Employee-Operations':
                updateQuery = 'UPDATE employee_view SET Password = ? WHERE Employee_ID = ?';
                break;
            default:
                return res.status(403).json({ success: false, message: 'Unauthorized role for password reset.' });
        }

        // Update the password in the determined table/view
        db.query(updateQuery, [hashedPassword, Employee_ID], (err, result) => {
            if (err) {
                console.error('Error updating password:', err);
                return res.status(500).json({ success: false, message: 'Error updating password.', error: err });
            }

            console.log('Password reset successfully for:', Employee_ID); // Log success
            return res.json({ success: true, message: 'Password reset successfully.' });
        });
    });
});

// Fetch specific employee details
app.get('/api/employees/:id', (req, res) => {
    const employeeId = req.params.id;
    const { role } = req.query; // Assuming the role is passed in the query

    // Base query for fetching an employee by ID
    let query = 'SELECT * FROM Employee WHERE Employee_ID = ?';

    // If role is Manager-Maintenance, restrict to Department_ID = 'D001'
    if (role === 'Manager-Maintenance') {
        query = 'SELECT * FROM Employee WHERE Employee_ID = ? AND Department_ID = "D002"';
    }

    if (role === 'Manager-Operations') {
        query = 'SELECT * FROM Employee WHERE Employee_ID = ? AND Department_ID = "D001"';
    }

    db.query(query, [employeeId], (err, results) => {
        if (err) {
            console.error('Error fetching employee details:', err);
            return res.status(500).json({ success: false, message: 'Database error.', error: err });
        }

        if (results.length > 0) {
            res.json(results[0]);
        } else {
            res.status(404).json({ success: false, message: 'Employee not found or not in your department.' });
        }
    });
});

// Fetch all employees or filter based on role
app.get('/api/employees', (req, res) => {
    const { role } = req.query; // Assume the role is passed as a query param

    // Default query: fetch all employees
    let query = 'SELECT * FROM Employee';

    // If the role is 'Manager-Maintenance', restrict to Department_ID = 'D001'
    if (role === 'Manager-Maintenance') {
        query = 'SELECT * FROM Employee WHERE Department_ID = "D002"';
    }

    if (role === 'Manager-Operations') {
        query = 'SELECT * FROM Employee WHERE Department_ID = "D001"';
    }

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching employees:', err);
            return res.status(500).json({ success: false, message: 'Database error.', error: err });
        }

        // Return the results as JSON
        res.json(results);
    });
});


// Add new employee
app.post('/api/employees', (req, res) => {
    const {
        Employee_ID,
        Employee_Name,
        Employee_Role,
        Salary,
        Department_ID,
        Date_of_Joining,
        Contact_Details,
        Address,
        Last_Paid_Date,
        Salary_Updated_On,
        Status,
        Password
    } = req.body;

    // Hash the password
    const hashedPassword = crypto.createHash('sha256').update(Password).digest('hex');

    const query = `
        INSERT INTO Employee 
        (Employee_ID, Employee_Name, Employee_Role, Salary, Department_ID, Date_of_Joining, Contact_Details, Address, Last_Paid_Date,
        Salary_Updated_On, Status, Password) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(query, [Employee_ID, Employee_Name, Employee_Role, Salary, Department_ID, Date_of_Joining, Contact_Details, Address, Last_Paid_Date,
        Salary_Updated_On, Status, hashedPassword], (err, result) => {
        if (err) {
            console.error('Error adding employee:', err);
            return res.status(500).json({ success: false, message: 'Error adding employee.', error: err });
        }

        // Increment the employee count in the department
        const updateDeptQuery = `UPDATE Department SET No_of_Employees = No_of_Employees + 1 WHERE Department_ID = ?`;
        db.query(updateDeptQuery, [Department_ID], (err, updateResult) => {
            if (err) {
                console.error('Error updating department count:', err);
                return res.status(500).json({ success: false, message: 'Error updating department count.', error: err });
            }

            res.json({ success: true, message: 'Employee added successfully, and department count updated.' });
        });
    });
});

//removing employee
app.delete('/api/employees/:id', (req, res) => {
    const { id } = req.params;

    // First, get the Department_ID of the employee to be removed
    const getDeptQuery = `SELECT Department_ID FROM Employee WHERE Employee_ID = ?`;

    db.query(getDeptQuery, [id], (err, result) => {
        if (err) {
            console.error('Error finding employee:', err);
            return res.status(500).json({ success: false, message: 'Error finding employee.', error: err });
        }

        if (result.length === 0) {
            return res.status(404).json({ success: false, message: 'Employee not found.' });
        }

        const departmentID = result[0].Department_ID;

        // Proceed with deleting the employee
        const deleteEmployeeQuery = 'DELETE FROM Employee WHERE Employee_ID = ?';

        db.query(deleteEmployeeQuery, [id], (err, deleteResult) => {
            if (err) {
                console.error('Error removing employee:', err);
                return res.status(500).json({ success: false, message: 'Error removing employee.', error: err });
            }

            if (deleteResult.affectedRows === 0) {
                return res.status(404).json({ success: false, message: 'Employee not found.' });
            }

            // Decrement the employee count in the department
            const updateDeptQuery = `UPDATE Department SET No_of_Employees = No_of_Employees - 1 WHERE Department_ID = ?`;

            db.query(updateDeptQuery, [departmentID], (err, updateResult) => {
                if (err) {
                    console.error('Error updating department count:', err);
                    return res.status(500).json({ success: false, message: 'Error updating department count.', error: err });
                }

                res.json({ success: true, message: 'Employee removed successfully, and department count updated.' });
            });
        });
    });
});

// Update employee details
app.put('/api/employees/:id', (req, res) => {
    const { id } = req.params; // Employee ID from the URL
    const {
        Employee_Name,
        Contact_Details,
        Address,
        Last_Paid_Date,
        Salary,
        Department_ID // If needed for any cross-checking
    } = req.body;

    const { role } = req.query; // This is the role of the person making the update request (Admin or Manager-Maintenance)

    // Check the existence of the employee being updated
    const checkEmployeeQuery = `
        SELECT Employee_Role, Department_ID 
        FROM employee
        WHERE Employee_ID = ?
    `;

    db.query(checkEmployeeQuery, [id], (err, results) => {
        if (err) {
            console.error('Error checking employee existence:', err);
            return res.status(500).json({ success: false, message: 'Error checking employee existence.', error: err });
        }

        if (results.length === 0) {
            return res.status(404).json({ success: false, message: 'Employee not found.' });
        }

        const employeeRole = results[0].Employee_Role; // Role of the employee being updated
        const currentDepartmentID = results[0].Department_ID; // Employee's current department

        let updateQuery;
        let queryParams;

        // Logic for Admin role - full access
        if (role === 'Admin') {
            updateQuery = `
                UPDATE employee
                SET Last_Paid_Date = ?, Salary = ?, Employee_Name = ?, Contact_Details = ?, Address = ?
                WHERE Employee_ID = ?
            `;
            queryParams = [Last_Paid_Date, Salary, Employee_Name, Contact_Details, Address, id];
        } 
        // Logic for Manager-Maintenance role
        else if (role === 'Manager-Maintenance') {
            // If the employee is a manager themselves, restrict salary updates
            if (employeeRole === 'Manager-Maintenance') {
                if (Last_Paid_Date || Salary || Salary_Updated_On) {
                    return res.status(403).json({ success: false, message: 'Managers cannot update Salary or Last Paid Date or Salary Last Updated on for a manager.' });
                }
                updateQuery = `
                    UPDATE manager_maintenance_own_employee_view
                    SET Employee_Name = ?, Contact_Details = ?, Address = ?
                    WHERE Employee_ID = ?
                `;
                queryParams = [Employee_Name, Contact_Details, Address, id];
            } else {
                // If the employee being updated is not a manager, allow full update
                updateQuery = `
                    UPDATE manager_maintenance_department_employees_view
                    SET Last_Paid_Date = ?, Salary = ?
                    WHERE Employee_ID = ?
                `;
                queryParams = [Last_Paid_Date, Salary, id];
            }
        } else if (role === 'Manager-Operations') {
            // If the employee is a manager themselves, restrict salary updates
            if (employeeRole === 'Manager-Operations') {
                if (Last_Paid_Date || Salary || Salary_Updated_On) {
                    return res.status(403).json({ success: false, message: 'Managers cannot update Salary or Last Paid Date or Salary Last Updated on for a manager.' });
                }
                updateQuery = `
                    UPDATE operations_manager_own_employee_view
                    SET Employee_Name = ?, Contact_Details = ?, Address = ?
                    WHERE Employee_ID = ?
                `;
                queryParams = [Employee_Name, Contact_Details, Address, id];
            } else {
                // If the employee being updated is not a manager, allow full update
                updateQuery = `
                    UPDATE operations_manager_department_employees_view
                    SET Last_Paid_Date = ?, Salary = ?
                    WHERE Employee_ID = ?
                `;
                queryParams = [Last_Paid_Date, Salary, id];
            }
        } 
        // If neither Admin nor Manager-Maintenance role, deny update
        else {
            return res.status(403).json({ success: false, message: 'Unauthorized role for updating employees.' });
        }

        // Execute the update query
        db.query(updateQuery, queryParams, (err, result) => {
            if (err) {
                console.error('Error updating employee:', err);
                return res.status(500).json({ success: false, message: 'Error updating employee.', error: err });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ success: false, message: 'Employee not found.' });
            }

            // If Department_ID changes, update department counts
            if (Department_ID && currentDepartmentID !== Department_ID) {
                const decreasePreviousDepartmentCountQuery = `
                    UPDATE Department
                    SET No_of_Employees = No_of_Employees - 1
                    WHERE Department_ID = ?
                `;
                db.query(decreasePreviousDepartmentCountQuery, [currentDepartmentID], (err) => {
                    if (err) {
                        console.error('Error updating previous department count:', err);
                        return res.status(500).json({ success: false, message: 'Error updating department count.', error: err });
                    }

                    const increaseNewDepartmentCountQuery = `
                        UPDATE Department
                        SET No_of_Employees = No_of_Employees + 1
                        WHERE Department_ID = ?
                    `;
                    db.query(increaseNewDepartmentCountQuery, [Department_ID], (err) => {
                        if (err) {
                            console.error('Error updating new department count:', err);
                            return res.status(500).json({ success: false, message: 'Error updating department count.', error: err });
                        }

                        return res.json({ success: true, message: 'Employee updated successfully, department counts adjusted.' });
                    });
                });
            } else {
                return res.json({ success: true, message: 'Employee updated successfully.' });
            }
        });
    });
});

app.put('/api/profile/:id', (req, res) => {
    const { id } = req.params; // Employee ID from the URL
    const { Employee_Name, Contact_Details, Address } = req.body; // Data to update
    console.log('Received ID for update:', id);

    // Input validation
    if (!Employee_Name || !Contact_Details || !Address) {
        return res.status(400).json({ success: false, message: 'Invalid input data.' });
    }

    const checkEmployeeQuery = `
        SELECT Employee_Role 
        FROM employee
        WHERE Employee_ID = ?
    `;

    db.query(checkEmployeeQuery, [id], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ success: false, message: 'Internal server error.' });
        }

        if (results.length === 0) {
            return res.status(404).json({ success: false, message: 'Employee not found.' });
        }

        const employeeRole = results[0].Employee_Role; // Fetching employee role

        // Check if the employee role is one of the allowed roles
        if (employeeRole === 'Employee-Operations' || employeeRole === 'Employee-Maintenance') {
            const callProcedure = `
                CALL UpdateOwnRecord(?, ?, ?, ?)
            `;
            const queryParams = [id, Address, Contact_Details, Employee_Name];

            // Execute the stored procedure
            db.query(callProcedure, queryParams, (err, result) => {
                if (err) {
                    console.error('Database error during procedure call:', err);
                    return res.status(500).json({ success: false, message: 'Internal server error.' });
                }

                return res.json({ success: true, message: 'Profile updated successfully.' });
            });
        } else {
            // Handle other roles
            let updateQuery;
            const queryParams = [Employee_Name, Contact_Details, Address, id];

            // Check role and build the update query accordingly
            if (employeeRole === 'Admin') {
                updateQuery = `
                    UPDATE employee
                    SET Employee_Name = ?, Contact_Details = ?, Address = ?
                    WHERE Employee_ID = ?
                `;
            } else if (employeeRole === 'Manager-Maintenance') {
                updateQuery = `
                    UPDATE manager_maintenance_own_employee_view
                    SET Employee_Name = ?, Contact_Details = ?, Address = ?
                    WHERE Employee_ID = ?
                `;
            } else if (employeeRole === 'Manager-Operations') {
                updateQuery = `
                    UPDATE operations_manager_own_employee_view
                    SET Employee_Name = ?, Contact_Details = ?, Address = ?
                    WHERE Employee_ID = ?
                `;
            } else {
                return res.status(400).json({ success: false, message: 'Invalid employee role.' });
            }

            console.log('Update Query for Employee View:', updateQuery);
            console.log('Update Query Parameters:', queryParams);

            // Execute the update query
            db.query(updateQuery, queryParams, (err, result) => {
                if (err) {
                    console.error('Database error during update:', err);
                    return res.status(500).json({ success: false, message: 'Internal server error.' });
                }

                if (result.affectedRows === 0) {
                    console.log('No changes made for Employee ID:', id);
                    return res.status(404).json({ success: false, message: 'No changes made; employee may not exist.' });
                }

                return res.json({ success: true, message: 'Profile updated successfully.' });
            });
        }
    });
});

// Fetch all departments
app.get('/api/departments', (req, res) => {
    const query = 'SELECT * FROM Department'; // Adjust table name as per your database
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching departments:', err);
            return res.status(500).json({ success: false, message: 'Database error.', error: err });
        }
        res.json(results);
    });
});

// Add new department
app.post('/api/departments', (req, res) => {
    const { 
        Department_ID, 
        Department_Name, 
        Department_HeadID, 
        Room_ID 
    } = req.body;

    const query = `
        INSERT INTO Department 
        (Department_ID, Department_Name, Department_HeadID, No_of_Employees, Room_ID) 
        VALUES (?, ?, ?, 0, ?)
    `;

    db.query(query, [Department_ID, Department_Name, Department_HeadID, Room_ID], (err, result) => {
        if (err) {
            console.error('Error adding department:', err);
            return res.status(500).json({ success: false, message: 'Error adding department.', error: err });
        }
        res.json({ success: true, message: 'Department added successfully.' });
    });
});

// Remove department by Department_ID
app.delete('/api/departments/:id', (req, res) => {
    const { id } = req.params;

    const query = 'DELETE FROM Department WHERE Department_ID = ?'; // Adjust table name as per your database
    
    db.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error removing department:', err);
            return res.status(500).json({ success: false, message: 'Error removing department.', error: err });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Department not found.' });
        }

        res.json({ success: true, message: 'Department removed successfully.' });
    });
});

app.get('/api/departments/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM department WHERE Department_ID = ?';
    db.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error fetching department:', err);
            res.status(500).send('Error fetching department');
            return;
        }
        if (result.length === 0) {
            res.status(404).send('Department not found');
            return;
        }
        res.json(result[0]);
    });
});

// Update department by ID
app.put('/api/departments/:id', (req, res) => {
    const { id } = req.params;
    const { Department_Name, Department_HeadID, No_of_Employees, Room_ID } = req.body;

    const query = `
        UPDATE department
        SET Department_Name = ?, Department_HeadID = ?, No_of_Employees = ?, Room_ID = ?
        WHERE Department_ID = ?
    `;

    db.query(query, [Department_Name, Department_HeadID, No_of_Employees, Room_ID, id], (err, result) => {
        if (err) {
            console.error('Error updating department:', err);
            res.status(500).send('Error updating department');
            return;
        }

        res.send('Department updated successfully');
    });
});

//machine
app.get('/api/machines', (req, res) => {
    const query = 'SELECT * FROM Machine'; // Ensure your table name is correct
    db.query(query, (err, result) => {
        if (err) return res.status(500).json({ success: false, message: 'Error fetching machines.', error: err });
        res.json(result);
    });
});

app.get('/api/machines/:id', (req, res) => {
    const { id } = req.params;
    const query = `SELECT * FROM machine WHERE Machine_ID = ?`;
    db.query(query, [id], (err, result) => {
        if (err) return res.status(500).json({ success: false, message: 'Error fetching machine data.', error: err });
        if (result.length === 0) return res.status(404).json({ success: false, message: 'Machine not found.' });
        res.json(result[0]);
    });
});

app.post('/api/machines', (req, res) => {
    const { 
        Machine_ID, // Make sure to provide this in the request body
        Machine_Type, 
        Room_ID,
        Status,
        Last_Maintenance_Date,
        Next_Scheduled_Maintenance,
        Assigned_EmployeeID
    } = req.body;

    // Step 1: Query to check the room's capacity and current machine count
    const checkRoomQuery = `
        SELECT Capacity, Machine_Count 
        FROM Floorplan 
        WHERE Room_ID = ?
    `;

    db.query(checkRoomQuery, [Room_ID], (err, results) => {
        if (err) {
            console.error('Error checking room:', err);
            return res.status(500).json({ success: false, message: 'Error checking room.', error: err });
        }

        if (results.length === 0) {
            // Room not found
            return res.status(404).json({ success: false, message: 'Room not found.' });
        }

        const { Capacity, Machine_Count } = results[0];

        // Step 2: Check if adding the new machine would exceed the capacity
        if (Machine_Count >= Capacity) {
            return res.status(400).json({ success: false, message: 'Cannot add machine. Room capacity exceeded.' });
        }

        // Step 3: Proceed to add the machine, including Machine_ID
        const insertMachineQuery = `
            INSERT INTO Machine 
            (Machine_ID, Machine_Type, Room_ID, Status, Last_Maintenance_Date, Next_Scheduled_Maintenance, Assigned_EmployeeID) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        db.query(insertMachineQuery, [Machine_ID, Machine_Type, Room_ID, Status, Last_Maintenance_Date, Next_Scheduled_Maintenance, Assigned_EmployeeID], (err, result) => {
            if (err) {
                console.error('Error adding machine:', err);
                return res.status(500).json({ success: false, message: 'Error adding machine.', error: err });
            }

            // Step 4: Update Machine_Count for the room
            const updateCountQuery = `
                UPDATE Floorplan 
                SET Machine_Count = Machine_Count + 1 
                WHERE Room_ID = ?
            `;

            db.query(updateCountQuery, [Room_ID], (err) => {
                if (err) {
                    console.error('Error updating room machine count:', err);
                    return res.status(500).json({ success: false, message: 'Machine added, but error updating count.', error: err });
                }

                const remainingCapacity = Capacity - (Machine_Count + 1); // After adding the new machine
                res.json({
                    success: true, 
                    message: `Machine added successfully. Room has ${Machine_Count + 1}/${Capacity} machines. ${remainingCapacity} more machines can be added.`
                });
            });
        });
    });
});

app.put('/api/machines/:id', (req, res) => {
    const { id } = req.params;
    const { role } = req.query; // Get the role from the query
    const { Machine_Type, Room_ID, Status, Last_Maintenance_Date, Next_Scheduled_Maintenance, Assigned_EmployeeID } = req.body;

    // Convert dates to 'YYYY-MM-DD' format
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
    };

    const formattedLastMaintenanceDate = formatDate(Last_Maintenance_Date);
    const formattedNextScheduledMaintenance = formatDate(Next_Scheduled_Maintenance);

    const getCurrentRoomQuery = 'SELECT Room_ID FROM machine WHERE Machine_ID = ?';

    db.query(getCurrentRoomQuery, [id], (err, result) => {
        if (err) {
            console.error('SQL Error (Fetching current room):', err);
            return res.status(500).json({ success: false, message: 'Error fetching current room for machine.', error: err });
        }
        if (result.length === 0) return res.status(404).json({ success: false, message: 'Machine not found.' });

        const currentRoomID = result[0].Room_ID;

        let updateMachineQuery;
        let queryParams;

        if (role === 'Manager-Maintenance') {
            // Limited update for Manager-Maintenance
            updateMachineQuery = `
                UPDATE machine 
                SET  
                    Status = ?, 
                    Last_Maintenance_Date = ?, 
                    Next_Scheduled_Maintenance = ?, 
                    Assigned_EmployeeID = ? 
                WHERE Machine_ID = ?`;

            queryParams = [Status, formattedLastMaintenanceDate, formattedNextScheduledMaintenance, Assigned_EmployeeID, id];
        } else if (role === 'Manager-Operations') {
            // Allow only Machine_Type update for Manager-Operations
            updateMachineQuery = `
                UPDATE machine 
                SET 
                    Machine_Type = ? 
                WHERE Machine_ID = ?`;

            queryParams = [Machine_Type, id];
        } else if (role === 'Employee-Maintenance') {
            // Allow only Machine_Type update for Manager-Operations
            updateMachineQuery = `
                UPDATE machine 
                SET 
                    Status = ?, 
                    Last_Maintenance_Date = ?, 
                    Next_Scheduled_Maintenance = ? 
                WHERE Machine_ID = ?`;

            queryParams = [Status, formattedLastMaintenanceDate, formattedNextScheduledMaintenance, id];
        } else {
            // Full update for Admin role
            updateMachineQuery = `
                UPDATE machine 
                SET 
                    Machine_Type = ?, 
                    Room_ID = ?, 
                    Status = ?, 
                    Last_Maintenance_Date = ?, 
                    Next_Scheduled_Maintenance = ?, 
                    Assigned_EmployeeID = ? 
                WHERE Machine_ID = ?`;

            queryParams = [Machine_Type, Room_ID, Status, formattedLastMaintenanceDate, formattedNextScheduledMaintenance, Assigned_EmployeeID, id];
        }

        db.query(updateMachineQuery, queryParams, (err, result) => {
            if (err) {
                console.error('SQL Error (Updating machine):', err);
                return res.status(500).json({ success: false, message: 'Error updating machine.', error: err });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ success: false, message: 'Machine not found.' });
            }

            // Handle room adjustment logic if necessary
            if (role !== 'Manager-Maintenance' && Room_ID !== currentRoomID) {
                const decreasePreviousRoomCountQuery = 'UPDATE floorplan SET Machine_Count = Machine_Count - 1 WHERE Room_ID = ?';
                db.query(decreasePreviousRoomCountQuery, [currentRoomID], (err, result) => {
                    if (err) {
                        console.error('SQL Error (Decreasing previous room machine count):', err);
                        return res.status(500).json({ success: false, message: 'Error updating previous room machine count.', error: err });
                    }

                    const increaseNewRoomCountQuery = 'UPDATE floorplan SET Machine_Count = Machine_Count + 1 WHERE Room_ID = ?';
                    db.query(increaseNewRoomCountQuery, [Room_ID], (err, result) => {
                        if (err) {
                            console.error('SQL Error (Increasing new room machine count):', err);
                            return res.status(500).json({ success: false, message: 'Error updating new room machine count.', error: err });
                        }

                        res.json({ success: true, message: 'Machine updated and room machine count adjusted successfully.' });
                    });
                });
            } else {
                res.json({ success: true, message: 'Machine updated successfully.' });
            }
        });
    });
});

app.delete('/api/machines/:id', (req, res) => {
    const { id } = req.params;
    
    // First, get the Room_ID associated with the machine to be deleted
    const getRoomQuery = `SELECT Room_ID FROM machine WHERE Machine_ID = ?`;
    
    db.query(getRoomQuery, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Error finding machine.', error: err });
        }
        
        if (result.length === 0) {
            return res.status(404).json({ success: false, message: 'Machine not found.' });
        }
        
        const roomID = result[0].Room_ID;
        
        // Proceed with deleting the machine
        const deleteMachineQuery = `DELETE FROM machine WHERE Machine_ID = ?`;
        
        db.query(deleteMachineQuery, [id], (err, deleteResult) => {
            if (err) {
                return res.status(500).json({ success: false, message: 'Error deleting machine.', error: err });
            }
            
            if (deleteResult.affectedRows === 0) {
                return res.status(404).json({ success: false, message: 'Machine not found.' });
            }

            // Log the roomID to make sure we have the correct room
            console.log('Room ID:', roomID);
            
            // Check current count before updating
            const checkCountQuery = `SELECT Machine_Count FROM floorplan WHERE Room_ID = ?`;
            db.query(checkCountQuery, [roomID], (err, countResult) => {
                if (err) {
                    return res.status(500).json({ success: false, message: 'Error retrieving machine count.', error: err });
                }
                
                const currentCount = countResult[0]?.Machine_Count || 0;

                console.log('Current Machine Count:', currentCount);

                if (currentCount > 0) {
                    // Decrement the count
                    const updateRoomCountQuery = `
                        UPDATE floorplan 
                        SET Machine_Count = Machine_Count - 1 
                        WHERE Room_ID = ?
                    `;
                    
                    db.query(updateRoomCountQuery, [roomID], (err, updateResult) => {
                        if (err) {
                            return res.status(500).json({ success: false, message: 'Error updating room machine count.', error: err });
                        }
                        
                        res.json({ success: true, message: 'Machine deleted and room machine count updated successfully.' });
                    });
                } else {
                    // Machine count is already 0 or negative
                    res.json({ success: true, message: 'Machine deleted successfully, but machine count was already 0.' });
                }
            });
        });
    });
});

//materials
app.get('/api/materials', (req, res) => {
    const query = 'SELECT * FROM material'; // Adjust table name as per your database
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching materials:', err);
            return res.status(500).json({ success: false, message: 'Database error.', error: err });
        }
        res.json(results);
    });
});

app.post('/api/materials', (req, res) => {
    const { Material_ID, Material_Name, Source, Status, Process_ID } = req.body;

    const query = `
        INSERT INTO material (Material_ID, Material_Name, Source, Status, Process_ID) 
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(query, [Material_ID, Material_Name, Source, Status, Process_ID], (err, result) => {
        if (err) {
            console.error('SQL Error:', err);
            return res.status(500).json({ success: false, message: 'Error adding material.', error: err });
        }
        res.json({ success: true, message: 'Material added successfully.', data: { Material_ID, Material_Name, Source, Status, Process_ID } });
    });
});

app.get('/api/materials/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM material WHERE Material_ID = ?';
    db.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error fetching material:', err);
            res.status(500).send('Error fetching material');
            return;
        }
        if (result.length === 0) {
            res.status(404).send('Material not found');
            return;
        }
        res.json(result[0]);
    });
});

app.put('/api/materials/:id', (req, res) => {
    const { id } = req.params;
    const { Material_Name, Source, Status, Process_ID } = req.body;

    const { role } = req.query;

    let updateQuery;
    let queryParams;

    if (role === 'Employee-Operations') {
        // Operations employees should not update 'Material_Name', so it is excluded here
        updateQuery = `
            UPDATE material 
            SET  
                Source = ?, 
                Status = ?, 
                Process_ID = ?
            WHERE Material_ID = ?`;
        queryParams = [Source, Status, Process_ID, id];
    } else {
        // Admin or other roles can update everything, including Material_Name
        updateQuery = `
            UPDATE material 
            SET 
                Material_Name = ?, 
                Source = ?, 
                Status = ?, 
                Process_ID = ? 
            WHERE Material_ID = ?`;
        queryParams = [Material_Name, Source, Status, Process_ID, id];
    }

    db.query(updateQuery, queryParams, (err, result) => {
        if (err) {
            console.error('SQL Error:', err);
            return res.status(500).json({ success: false, message: 'Error updating material.', error: err });
        }
        if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Material not found.' });
        res.json({ success: true, message: 'Material updated successfully.' });
    });
});

app.delete('/api/materials/:id', (req, res) => {
    const { id } = req.params;

    const query = 'DELETE FROM material WHERE Material_ID = ?';

    db.query(query, [id], (err, result) => {
        if (err) {
            console.error('SQL Error:', err);
            return res.status(500).json({ success: false, message: 'Error deleting material.', error: err });
        }
        if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Material not found.' });
        res.json({ success: true, message: 'Material deleted successfully.' });
    });
});

//processes
app.get('/api/processes', (req, res) => {
    const query = 'SELECT * FROM process'; // Adjust table name as per your database
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching processes:', err);
            return res.status(500).json({ success: false, message: 'Database error.', error: err });
        }
        res.json(results);
    });
});

app.post('/api/processes', (req, res) => {
    const { Process_ID, Process_Name, Description, Process_Type } = req.body;

    const query = `
        INSERT INTO process (Process_ID, Process_Name, Description, Process_Type) 
        VALUES (?, ?, ?, ?)
    `;

    db.query(query, [Process_ID, Process_Name, Description, Process_Type], (err, result) => {
        if (err) {
            console.error('SQL Error:', err);
            return res.status(500).json({ success: false, message: 'Error adding process.', error: err });
        }
        res.json({ success: true, message: 'Processs added successfully.', data: { Process_ID, Process_Name, Description, Process_Type } });
    });
});

app.get('/api/processes/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM process WHERE Process_ID = ?';
    db.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error fetching process:', err);
            res.status(500).send('Error fetching process');
            return;
        }
        if (result.length === 0) {
            res.status(404).send('Process not found');
            return;
        }
        res.json(result[0]);
    });
});

app.put('/api/processes/:id', (req, res) => {
    const { id } = req.params;
    const { Process_Name, Description, Process_Type } = req.body;

    const query = `
        UPDATE process 
        SET 
            Process_Name = ?, 
            Description = ?, 
            Process_Type = ? 
        WHERE Process_ID = ?
    `;

    db.query(query, [Process_Name, Description, Process_Type, id], (err, result) => {
        if (err) {
            console.error('SQL Error:', err);
            return res.status(500).json({ success: false, message: 'Error updating process.', error: err });
        }
        if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Process not found.' });
        res.json({ success: true, message: 'Process updated successfully.' });
    });
});

app.delete('/api/processes/:id', (req, res) => {
    const { id } = req.params;

    const query = 'DELETE FROM process WHERE Process_ID = ?';

    db.query(query, [id], (err, result) => {
        if (err) {
            console.error('SQL Error:', err);
            return res.status(500).json({ success: false, message: 'Error deleting process.', error: err });
        }
        if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Process not found.' });
        res.json({ success: true, message: 'Process deleted successfully.' });
    });
});

//material inventory
app.get('/api/material_inventory', (req, res) => {
    const query = 'SELECT * FROM material_inventory'; // Adjust table name as per your database
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching material_inventory:', err);
            return res.status(500).json({ success: false, message: 'Database error.', error: err });
        }
        res.json(results);
    });
});

app.post('/api/material_inventory', (req, res) => {
    const { Material_Inventory_ID, Material_Name, Quantity, Unit, Source, Last_Updated } = req.body;

    const query = `
        INSERT INTO material_inventory (Material_Inventory_ID, Material_Name, Quantity, Unit, Source, Last_Updated) 
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(query, [Material_Inventory_ID, Material_Name, Quantity, Unit, Source, Last_Updated], (err, result) => {
        if (err) {
            console.error('SQL Error:', err);
            return res.status(500).json({ success: false, message: 'Error adding material.', error: err });
        }
        res.json({ success: true, message: 'Material added successfully.', data: { Material_Inventory_ID, Material_Name, Quantity, Unit, Source, Last_Updated } });
    });
});

app.get('/api/material_inventory/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM material_inventory WHERE Material_Inventory_ID = ?';
    db.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error fetching material:', err);
            res.status(500).send('Error fetching material');
            return;
        }
        if (result.length === 0) {
            res.status(404).send('Material not found');
            return;
        }
        res.json(result[0]);
    });
});

app.put('/api/material_inventory/:id', (req, res) => {
    const { id } = req.params;
    const { role } = req.query; // Get the role from the query string
    const { Material_Name, Quantity, Unit, Source, Last_Updated } = req.body;

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toISOString().split('T')[0]; // Extract only the date part
    };

    const formattedLastUpdated = formatDate(Last_Updated);

    let updateQuery;
    let queryParams;

    if (role === 'Employee-Maintenance') {
        // Full update for Admin or other roles
        updateQuery = `
            UPDATE material_inventory 
            SET  
                Quantity = ?,  
                Source = ?, 
                Last_Updated = ?
            WHERE Material_Inventory_ID = ?`;
        queryParams = [Quantity, Source, formattedLastUpdated, id]
    } else if (role === 'Manager-Operations' || role === 'Employee-Operations') {
        // Full update for Admin or other roles
        updateQuery = `
            UPDATE material_inventory 
            SET 
                Quantity = ?, 
                Last_Updated = ?
            WHERE Material_Inventory_ID = ?`;
        queryParams = [Quantity, formattedLastUpdated, id];
    } else {
        // Full update for Admin or other roles
        updateQuery = `
            UPDATE material_inventory 
            SET 
                Material_Name = ?, 
                Quantity = ?, 
                Unit = ?, 
                Source = ?, 
                Last_Updated = ?
            WHERE Material_Inventory_ID = ?`;
        queryParams = [Material_Name, Quantity, Unit, Source, formattedLastUpdated, id];
    }

    db.query(updateQuery, queryParams, (err, result) => {
        if (err) {
            console.error('SQL Error:', err);
            return res.status(500).json({ success: false, message: 'Error updating material.', error: err });
        }
        if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Material not found.' });
        res.json({ success: true, message: 'Material updated successfully.' });
    });
});

app.delete('/api/material_inventory/:id', (req, res) => {
    const { id } = req.params;

    const query = 'DELETE FROM material_inventory WHERE Material_Inventory_ID = ?';

    db.query(query, [id], (err, result) => {
        if (err) {
            console.error('SQL Error:', err);
            return res.status(500).json({ success: false, message: 'Error deleting material.', error: err });
        }
        if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Material not found.' });
        res.json({ success: true, message: 'Material deleted successfully.' });
    });
});

// API route to get all floor plan data
app.get('/api/floorplan', (req, res) => {
    const query = 'SELECT * FROM floorplan';

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching floor plan:', err);
            return res.status(500).json({ success: false, message: 'Error fetching floor plan.', error: err });
        }
        res.json(results); // Send the result as JSON response
    });
});

app.get('/api/employee_attendance', (req, res) => {
    const query = 'SELECT * FROM employee_attendance';
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(results);
    });
});

// Add new employee attendance record
app.post('/api/employee_attendance', (req, res) => {
    const {
        Attendance_ID,
        Employee_ID,
        Date: attendanceDate,
        Shift_Type,
        Hours_Worked_Regular,
        Overtime_Hours,
        Leave_Type
    } = req.body;

    // First, get the Employee_Role and Department_ID based on Employee_ID
    const getEmployeeDetailsQuery = 'SELECT Employee_Role, Department_ID FROM Employee WHERE Employee_ID = ?';

    db.query(getEmployeeDetailsQuery, [Employee_ID], (err, results) => {
        if (err) {
            console.error('Error fetching employee details:', err);
            return res.status(500).json({ success: false, message: 'Database error.', error: err });
        }

        if (results.length === 0) {
            return res.status(404).json({ success: false, message: 'Employee not found.' });
        }

        const { Employee_Role, Department_ID } = results[0];

        const formatDate = (dateString) => {
            const date = new Date(dateString);
            if (isNaN(date)) {
                return null; // Handle invalid date
            }
            return date.toISOString().split('T')[0];
        };

        const formattedDate = formatDate(attendanceDate);
        if (!formattedDate) {
            return res.status(400).json({ success: false, message: 'Invalid date format.' });
        }

        const validLeaveTypes = ['Not Applicable', 'Sick', 'Casual', 'Unpaid'];
        if (!validLeaveTypes.includes(Leave_Type)) {
            return res.status(400).json({ success: false, message: 'Invalid leave type.' });
        }

        // Call the stored procedure
        const query = `CALL InsertAttendance(?, ?, ?, ?, ?, ?, ?, ?, ?);`

        db.query(query, [
            Attendance_ID,
            Employee_ID,
            Employee_Role,
            Department_ID,
            formattedDate,
            Shift_Type,
            Hours_Worked_Regular,
            Overtime_Hours,
            Leave_Type
        ], (err, result) => {
            if (err) {
                console.error('SQL Error:', err.message);
                return res.status(500).json({ success: false, message: 'Error adding employee attendance.', error: err });
            }

            const isNotApplicable = Leave_Type === 'Not Applicable';

            // Calculate attendance rate after adding the record
            calculateAttendanceRate(Employee_ID, isNotApplicable)
                .then(attendanceRate => {
                    res.json({ 
                        success: true, 
                        message: 'Employee attendance added successfully.', 
                        attendanceRate,
                        departmentId: Department_ID 
                    });
                })
                .catch(error => {
                    res.status(500).json({ success: false, message: 'Error calculating attendance rate.', error });
                });
        });
    });
});

// Get an employee attendance record by ID
app.get('/api/employee_attendance/employee/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM employee_attendance WHERE Employee_ID = ?';
    db.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error fetching employee attendance:', err);
            return res.status(500).send('Error fetching employee attendance');
        }
        if (result.length === 0) {
            return res.status(404).send('Attendance record not found');
        }
        res.json(result);
    });
});

app.get('/api/employee_attendance/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM employee_attendance WHERE Attendance_ID = ?';
    db.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error fetching employee attendance:', err);
            return res.status(500).send('Error fetching employee attendance');
        }
        if (result.length === 0) {
            return res.status(404).send('Attendance record not found');
        }
        res.json(result);
    });
});

// Update an employee attendance record
app.put('/api/employee_attendance/:id', (req, res) => {
    const { id } = req.params;
    const {
        Employee_ID,
        Date: attendanceDate,
        Shift_Type,
        Hours_Worked_Regular,
        Overtime_Hours,
        Leave_Type
    } = req.body;

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        if (isNaN(date)) {
            return null; // Handle invalid date
        }
        return date.toISOString().split('T')[0];
    };

    const formattedDate = formatDate(attendanceDate);

    if (!formattedDate) {
        return res.status(400).json({ success: false, message: 'Invalid date format.' });
    }

    const validLeaveTypes = ['Not Applicable', 'Sick', 'Casual', 'Unpaid'];
    if (!validLeaveTypes.includes(Leave_Type)) {
        return res.status(400).json({ success: false, message: 'Invalid leave type.' });
    }

    // Replace these with actual logic to get the Employee Role and Department ID if needed
    const employeeRole = 'Employee-Role'; // Fetch or define this dynamically
    const departmentID = 'Department-ID'; // Fetch or define this dynamically

    //console.log('Received Attendance Data:', attendanceData);
    const employeeQuery = `SELECT Employee_Role, Department_ID FROM employee_attendance WHERE Attendance_ID = ?`;

    db.query(employeeQuery, [id], (err, employeeResult) => {
        if (err) {
            console.error('Error fetching employee details:', err.message);
            return res.status(500).json({ success: false, message: 'Error fetching employee details.', error: err });
        }

        if (employeeResult.length === 0) {
            return res.status(404).json({ success: false, message: 'Employee not found.' });
        }

        const employeeRole = employeeResult[0].Employee_Role;
        const departmentID = employeeResult[0].Department_ID;

    const query = `CALL UpdateAttendance(?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    db.query(query, [
        id,
        Employee_ID,
        employeeRole,
        departmentID,
        formattedDate,
        Shift_Type,
        Hours_Worked_Regular,
        Overtime_Hours,
        Leave_Type
    ], (err, result) => {
        if (err) {
            console.error('SQL Error:', err.message);
            return res.status(500).json({ success: false, message: 'Error updating employee attendance.', error: err });
        }

        console.log('Stored Procedure Result:', result);
        res.json({
            success: true,
            message: 'Employee attendance updated successfully.',
            result // You can return the result if needed
            });
        });
    });
});

// Delete an employee attendance record
app.delete('/api/employee_attendance/:id', (req, res) => {
    const { id } = req.params;

    const query = 'DELETE FROM employee_attendance WHERE Attendance_ID = ?';

    db.query(query, [id], (err, result) => {
        if (err) {
            console.error('SQL Error:', err);
            return res.status(500).json({ success: false, message: 'Error deleting employee attendance.', error: err });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Attendance record not found.' });
        }
        res.json({ success: true, message: 'Employee attendance deleted successfully.' });
    });
});

app.get('/api/attendance/:id', (req, res) => {
    const { id } = req.params; // Employee ID from the URL
    console.log('Received ID for viewing attendance:', id);

    const checkEmployeeQuery = `
        SELECT Employee_Role 
        FROM employee
        WHERE Employee_ID = ?
    `;

    // Check the employee's role from the employee table
    db.query(checkEmployeeQuery, [id], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ success: false, message: 'Internal server error.' });
        }

        if (results.length === 0) {
            return res.status(404).json({ success: false, message: 'Employee not found.' });
        }

        const employeeRole = results[0].Employee_Role; // Fetching employee role

        let selectQuery;
        const queryParams = [id];

        // Determine the correct view or table based on the role
        if (employeeRole === 'Employee-Maintenance' || employeeRole === 'Employee-Operations') {
            selectQuery = `
                SELECT * FROM employee_attendance
                WHERE Employee_ID = ?
            `;
        } else if (employeeRole === 'Manager-Maintenance') {
            selectQuery = `
                SELECT * FROM manager_maintenance_own_attendance_view
                WHERE Employee_ID = ?
            `;
        } else if (employeeRole === 'Manager-Operations') {
            selectQuery = `
                SELECT * FROM operations_manager_own_attendance_view
                WHERE Employee_ID = ?
            `;
        } else if (employeeRole === 'Admin') {
            selectQuery = `
                SELECT * FROM employee_attendance
                WHERE Employee_ID = ?
            `;
        } else {
            return res.status(400).json({ success: false, message: 'Invalid employee role.' });
        }

        console.log('Select Query for Attendance View:', selectQuery);
        console.log('Select Query Parameters:', queryParams);

        // Execute the select query
        db.query(selectQuery, queryParams, (err, results) => {
            if (err) {
                console.error('Database error during attendance fetch:', err);
                return res.status(500).json({ success: false, message: 'Internal server error.' });
            }

            if (results.length === 0) {
                return res.status(404).json({ success: false, message: 'Attendance records not found.' });
            }

            return res.json({
                success: true,
                attendance: results // Return the attendance data
            });
        });
    });
});

app.get('/api/employee_attenenanance/manager', (req, res) => {
    const { role } = req.query; // Extract user role from the route parameters
    console.log('API called with role:', role);

    let selectQuery;
    
    if (role === 'Manager-Maintenance') {
        selectQuery = 'SELECT * FROM manager_maintenance_department_attendance_view';
    } else if (role === 'Manager-Operations') {
        selectQuery = 'SELECT * FROM operations_manager_department_attendance_view';
    } else {
        return res.status(400).json({ success: false, message: 'Invalid user role.' });
    }

    // Execute the query based on the user role
    db.query(selectQuery, (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ success: false, message: 'Internal server error.' });
        }

        // Always return an array in 'attendance' even if there are no results
        return res.json({
            success: true,
            attendance: results || [] // Default to an empty array if no results
        });
    });
});

app.put('/api/employee_attendance/manager/:id', (req, res) => {
    const { id } = req.params;
    const { role } = req.query;
    const {
        Employee_ID,
        Date: attendanceDate,
        Shift_Type,
        Hours_Worked_Regular,
        Overtime_Hours,
        Leave_Type
    } = req.body;

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        if (isNaN(date)) {
            return null; // Handle invalid date
        }
        return date.toISOString().split('T')[0];
    };

    const formattedDate = formatDate(attendanceDate);

    if (!formattedDate) {
        return res.status(400).json({ success: false, message: 'Invalid date format.' });
    }

    const validLeaveTypes = ['Not Applicable', 'Sick', 'Casual', 'Unpaid'];
    if (!validLeaveTypes.includes(Leave_Type)) {
        return res.status(400).json({ success: false, message: 'Invalid leave type.' });
    }

    const employeeQuery = `SELECT Employee_Role, Department_ID FROM employee_attendance WHERE Attendance_ID = ?`;

    db.query(employeeQuery, [id], (err, employeeResult) => {
        if (err) {
            console.error('Error fetching employee details:', err.message);
            return res.status(500).json({ success: false, message: 'Error fetching employee details.', error: err });
        }

        if (employeeResult.length === 0) {
            return res.status(404).json({ success: false, message: 'Employee not found.' });
        }

        const departmentID = employeeResult[0].Department_ID;

        // Determine which stored procedure to call based on the role
        let query;
        if (role === 'Manager-Maintenance') {
            query = `CALL UpdateAttendance(?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        } else if (role === 'Manager-Operations') {
            query = `CALL UpdateOperationsAttendance(?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        } else {
            return res.status(400).json({ success: false, message: 'Invalid role provided.' });
        }

        db.query(query, [
            id,
            Employee_ID,
            role,
            departmentID,
            formattedDate,
            Shift_Type,
            Hours_Worked_Regular,
            Overtime_Hours,
            Leave_Type
        ], (err, result) => {
            if (err) {
                console.error('SQL Error:', err.message);
                return res.status(500).json({ success: false, message: 'Error updating employee attendance.', error: err });
            }

            console.log('Stored Procedure Result:', result);
            res.json({
                success: true,
                message: 'Employee attendance updated successfully.',
                result // You can return the result if needed
            });
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
