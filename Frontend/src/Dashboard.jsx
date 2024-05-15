import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from './Card';

const Dashboard = () => {
    const [equipment, setEquipment] = useState([]);

    useEffect(() => {
        const fetchEquipment = async () => {
            try {
                const response = await axios.get('http://localhost:3000/equipment');
                setEquipment(response.data);
            } catch (error) {
                console.error('Error fetching equipment:', error);
            }
        };

        fetchEquipment();
    }, []);

    return (
        <div className="dashboard">
            <h1>Equipment Dashboard</h1>
            <div className="cards-container">
                {equipment.map(item => (
                    <Card key={item._id} item={item} />
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
