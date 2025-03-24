import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Import Link
import '../styles/ManMainMat.css'

const ViewMaterials = () => {
    const [materials, setMaterials] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch materials from the server
        axios.get('http://localhost:5000/api/materials')
            .then(response => setMaterials(response.data))
            .catch(error => console.error('Error fetching materials:', error));
    }, []);

    return (
        <div className='manmain-mat-wrapper'>
        <div className='manmain-mat-container' style={{ textAlign: 'center', marginTop: '50px' }}>
            <h2 className='manmain-mat-title'>Manage Materials</h2>
            <Link to="/manageroperations/materials/add">
                <button className='manmain-mat-add-button' style={{ padding: '10px 20px', marginBottom: '20px' }}>Add Material</button>
            </Link>
            <table className='manmain-mat-table' style={{ margin: '0 auto', border: '1px solid black', padding: '10px' }}>
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
                                <Link to={`/manageroperations/materials/edit/${material.Material_ID}`}>
                                    <button className='manmain-mat-edit-button' style={{ marginLeft: '10px' }}>
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
