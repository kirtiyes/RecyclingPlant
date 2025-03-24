import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Import Link
import '../styles/ManMainViewMatInv.css'

const ManagerOperationsViewMatInv = () => {
    const [material_inventory, setMaterialInventory] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch materials from the server
        axios.get('http://localhost:5000/api/material_inventory')
            .then(response => setMaterialInventory(response.data))
            .catch(error => console.error('Error fetching materials:', error));
    }, []);

    return (
        <div className='view-manmainmatinv-wrapper'>
        <div className='view-manmainmatinv-container' style={{ textAlign: 'center', marginTop: '50px' }}>
            <h2 className='view-manmainmatinv-title'>Manage Materials</h2>
            <table className='view-manmainmatinv-table' style={{ margin: '0 auto', border: '1px solid black', padding: '10px' }}>
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
                                <Link to={`/manageroperations/material_inventory/edit/${materialInventory.Material_Inventory_ID}`}>
                                    <button className='view-manmainmatinv-edit-button' style={{ marginLeft: '10px' }}>
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

export default ManagerOperationsViewMatInv;
