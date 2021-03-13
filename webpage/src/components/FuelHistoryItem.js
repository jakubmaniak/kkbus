import React from 'react';
import '../styles/Fuel.css';

function FuelHistoryItem(props) {
    return (
        <div className="fuel-usage-history">
            <span>{props.date}</span>
            <span>{props.price} zł</span>
            <span>{props.liters} L</span>
            <span>{props.vehicleMileage} KM</span>
        </div>
    );
}

export default  FuelHistoryItem;
