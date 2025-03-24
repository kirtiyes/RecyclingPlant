import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Import Link
import '../styles/AdminMatInv.css'

const ViewMaterialInventory = () => {
    const [material_inventory, setMaterialInventory] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch materials from the server
        axios.get('http://localhost:5000/api/material_inventory')
            .then(response => setMaterialInventory(response.data))
            .catch(error => console.error('Error fetching materials:', error));
    }, []);

    const handleRemoveMaterialInventory = (materialInventoryId) => {
        if (window.confirm("Are you sure you want to remove this material?")) {
            axios.delete(`http://localhost:5000/api/material_inventory/${materialInventoryId}`)
                .then(() => {
                    setMaterialInventory(material_inventory.filter(matInv => matInv.Material_Inventory_ID !== materialInventoryId));
                })
                .catch(error => console.error('Error removing material:', error));
        }
    };

    return (
        <div className='matinv-wrapper'>
        <div className="matinv-container" style={{ textAlign: 'center', marginTop: '50px' }}>
            <h2>Manage Materials</h2>
            <Link to="/admin/material_inventory/add">
                <button className="matinv-add-button" style={{ padding: '10px 20px', marginBottom: '20px' }}>Add Material</button>
            </Link>
            <table className='matinv-table' style={{ margin: '0 auto', border: '1px solid black', padding: '10px' }}>
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
                                <button className="matinv-remove-button" onClick={() => handleRemoveMaterialInventory(materialInventory.Material_Inventory_ID)}>
                                    Remove
                                </button>
                                <Link to={`/admin/material_inventory/edit/${materialInventory.Material_Inventory_ID}`}>
                                    <button className="matinv-edit-button" style={{ marginLeft: '10px' }}>
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

export default ViewMaterialInventory;
