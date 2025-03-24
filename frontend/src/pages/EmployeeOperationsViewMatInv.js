import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Import Link
import '../styles/EmpMatInv.css'

const EmployeeOperationsViewMatInv = () => {
    const [material_inventory, setMaterialInventory] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch materials from the server
        axios.get('http://localhost:5000/api/material_inventory')
            .then(response => setMaterialInventory(response.data))
            .catch(error => console.error('Error fetching materials:', error));
    }, []);

    return (
        <div className='empmatinv-wrapper'>
        <div className='empmatinv-container' style={{ textAlign: 'center', marginTop: '50px' }}>
            <h2 className='empmatinv-title'>Manage Materials</h2>
            <table className='empmatinv-table' style={{ margin: '0 auto', border: '1px solid black', padding: '10px' }}>
                <thead>
                    <tr>
                        <th>Material Inventory ID</th>
                        <th>Material Name</th>
                        <th>Quantity</th>
                        <th>Unit</th>
                        <th>Source</th>
                        <th>Last Updated</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {material_inventory.map(materialInventory => (
                        <tr key={materialInventory.Material_Inventory_ID}>
                            <td>{materialInventory.Material_Inventory_ID}</td>
                            <td>{materialInventory.Material_Name}</td>
                            <td>{materialInventory.Quantity}</td>
                            <td>{materialInventory.Unit}</td>
                            <td>{materialInventory.Source}</td>
                            <td>{new Date(materialInventory.Last_Updated).toLocaleDateString()}</td>
                            <td>
                                <Link to={`/employeeoperations/material_inventory/edit/${materialInventory.Material_Inventory_ID}`}>
                                    <button className='empmatinv-edit-button' style={{ marginLeft: '10px' }}>
                                        Edit
                                    </button>
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        </div>
    );
};

export default EmployeeOperationsViewMatInv;
