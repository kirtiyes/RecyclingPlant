import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Import Link
import '../styles/ViewMaterials.css'

const ViewMaterials = () => {
    const [materials, setMaterials] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch materials from the server
        axios.get('http://localhost:5000/api/materials')
            .then(response => setMaterials(response.data))
            .catch(error => console.error('Error fetching materials:', error));
    }, []);

    const handleRemoveMaterial = (materialId) => {
        if (window.confirm("Are you sure you want to remove this material?")) {
            axios.delete(`http://localhost:5000/api/materials/${materialId}`)
                .then(() => {
                    setMaterials(materials.filter(mat => mat.Material_ID !== materialId));
                })
                .catch(error => console.error('Error removing material:', error));
        }
    };

    return (
        <div className='view-materials-wrapper'>
        <div className='view-materials-container' style={{ textAlign: 'center', marginTop: '50px' }}>
            <h2 className='view-materials-title'>Manage Materials</h2>
            <Link to="/admin/materials/add">
                <button className='view-materials-add-button' style={{ padding: '10px 20px', marginBottom: '20px' }}>Add Material</button>
            </Link>
            <table className='view-materials-table' style={{ margin: '0 auto', border: '1px solid black', padding: '10px' }}>
                <thead>
                    <tr>
                        <th>Material ID</th>
                        <th>Material Name</th>
                        <th>Source</th>
                        <th>Status</th>
                        <th>Process ID</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {materials.map(material => (
                        <tr key={material.Material_ID}>
                            <td>{material.Material_ID}</td>
                            <td>{material.Material_Name}</td>
                            <td>{material.Source}</td>
                            <td>{material.Status}</td>
                            <td>{material.Process_ID}</td>
                            <td>
                                <button className='view-materials-remove-button' onClick={() => handleRemoveMaterial(material.Material_ID)}>
                                    Remove
                                </button>
                                <Link to={`/admin/materials/edit/${material.Material_ID}`}>
                                    <button className='view-materials-edit-button' style={{ marginLeft: '10px' }}>
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

export default ViewMaterials;
