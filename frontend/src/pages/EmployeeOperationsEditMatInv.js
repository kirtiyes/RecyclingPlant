import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../styles/EmpEditMatInv.css'

const EmployeeOperationsEditMatInv = ({ userRole }) => { // Accept userRole as a prop
    const { id } = useParams();
    const [material_inventory, setMaterialInventory] = useState({
        Material_Inventory_ID: '',
        Material_Name: '',
        Quantity: '',
        Unit: '',
        Source: '',
        Last_Updated: '',
    });

    const [message, setMessage] = useState(''); // State for showing success or error messages

    useEffect(() => {
        const fetchMaterialInventory = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/material_inventory/${id}`);
                setMaterialInventory(response.data); // Assuming response contains the material object
            } catch (error) {
                console.error('Error fetching material:', error);
                setMessage('Error fetching material data'); // Set error message
            }
        };

        fetchMaterialInventory();
    }, [id]);

    const handleChange = (e) => {
        setMaterialInventory({ ...material_inventory, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Send only Quantity and Last_Updated to the backend
            const updateData = {
                Quantity: material_inventory.Quantity,
                Last_Updated: material_inventory.Last_Updated
            };

            await axios.put(`http://localhost:5000/api/material_inventory/${id}?role=${userRole}`, updateData); // Include role in the query string
            setMessage('Material updated successfully!'); // Set success message
        } catch (error) {
            console.error('Error updating material:', error);
            setMessage('Error updating material: ' + (error.response?.data?.message || error.message)); // Set error message
        }
    };

    return (
        <div className='edit-empmatinv-wrapper'>
        <div className='edit-empmatinv-container' style={{ textAlign: 'center', marginTop: '50px' }}>
            <h2>Edit Material</h2>
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
                                    disabled
                                />
                            </td>
                        </tr>
                        <tr>
                            <td><label>Material Name:</label></td>
                            <td>
                                <input
                                    type="text"
                                    name="Material_Name"
                                    value={material_inventory.Material_Name}
                                    onChange={handleChange}
                                    disabled // Prevent editing Material_Name
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
                                    disabled // Prevent editing Unit
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
                                    disabled // Prevent editing Source
                                />
                            </td>
                        </tr>
                        <tr>
                            <td><label>Last Updated:</label></td>
                            <td>
                                <input
                                    type="date"
                                    name="Last_Updated"
                                    value={material_inventory.Last_Updated ? new Date(material_inventory.Last_Updated).toISOString().split('T')[0] : ''}
                                    onChange={handleChange}
                                    required
                                />
                            </td>
                        </tr>
                        <tr>
                            <td colSpan="2">
                                <button type="submit">Update Material</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </form>

            {message && <p>{message}</p>} {/* Conditionally display the message */}
        </div>
        </div>
    );
};

export default EmployeeOperationsEditMatInv;
