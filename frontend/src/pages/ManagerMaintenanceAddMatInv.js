import React, { useState } from 'react';
import axios from 'axios';
import '../styles/ManMainAddMat.css'

const ManagerMaintenanceAddMatInv = () => {
    const [material_inventory, setMaterialInventory] = useState({
        Material_Inventory_ID: '',
        Material_Name: '',
        Quantity: '',
        unit: '',
        Source: '',
        Last_Updated: '',
    });
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setMaterialInventory({ ...material_inventory, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/material_inventory', material_inventory);
            // Optionally, show a success message or reset form fields
            if (response.data.success) {
                setMessage('Material added successfully!');
                setMaterialInventory({
                    Material_Inventory_ID: '',
                    Material_Name: '',
                    Quantity: '',
                    Unit: '',
                    Source: '',
                    Last_Updated: '',
                });
            } else {
                setMessage((response.data.message));
            }
        } catch (error) {
            console.error('Error adding material:', error);
            setMessage('An error occurred. Please try again.');
        }
    };

    return (
        <div className='add-manmainmat-wrapper'>
        <div className='add-manmainmat-container' style={{ textAlign: 'center', marginTop: '50px' }}>
            <h2>Add Material</h2>
            <form onSubmit={handleSubmit}>
                <table style={{ margin: '0 auto' }}>
                    <tbody>
                        <tr>
                            <td><label>Material Inventory ID:</label></td>
                            <td>
                                <input
                                    type="text"
                                    name="Material_Inventory_ID"
                                    value={material_inventory.Material_Inventory_ID}
                                    onChange={handleChange}
                                    required
                                />
                            </td>
                        </tr>
                        <tr>
                            <td><label>Material Name:</label></td>
                            <td>
                                <input
                                    type="text"
                                    name="Material_Name"
                                    value={material_inventory.Material_Inventory_Name}
                                    onChange={handleChange}
                                    required
                                />
                            </td>
                        </tr>
                        <tr>
                            <td><label>Quantity:</label></td>
                            <td>
                                <input
                                    type="number"
                                    name="Quantity"
                                    value={material_inventory.Quantity}
                                    onChange={handleChange}
                                    required
                                />
                            </td>
                        </tr>
                        <tr>
                            <td><label>Unit:</label></td>
                            <td>
                                <input
                                    type="text"
                                    name="Unit"
                                    value={material_inventory.Unit}
                                    onChange={handleChange}
                                    required
                                />
                            </td>
                        </tr>
                        <tr>
                            <td><label>Source:</label></td>
                            <td>
                                <input
                                    type="text"
                                    name="Source"
                                    value={material_inventory.Source}
                                    onChange={handleChange}
                                    required
                                />
                            </td>
                        </tr>
                        <tr>
                            <td><label>Last Updated:</label></td>
                            <td>
                                <input
                                    type="date"
                                    name="Last_Updated"
                                    value={material_inventory.Last_Updated}
                                    onChange={handleChange}
                                    required
                                />
                            </td>
                        </tr>
                        <tr>
                            <td colSpan="2">
                                <button type="submit">Add Material</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </form>
            {message && <p>{message}</p>}
        </div>
        </div>
    );
};

export default ManagerMaintenanceAddMatInv;
