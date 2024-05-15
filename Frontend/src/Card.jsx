import React from 'react';

const Card = ({ item }) => {
    return (
        <div className="card">
            <img src={item.objectUrl} alt={item.equipmentName} />
            <div className="card-details">
                <h2>{item.equipmentName}</h2>
                <p>Pricing: ${item.pricing}</p>
            </div>
        </div>
    );
};

export default Card;
