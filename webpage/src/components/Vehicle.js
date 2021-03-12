import React from 'react';
import '../styles/VehicleInfo.css';

function Vehicle(props) {
    return (
        <div>
            <div className="tile">
                <h2>{props.name}</h2>
                <div className="vehicle-info">
                    <span>Stan pojazdu</span>
                    <span>{props.state}</span>
                </div>
                <div className="vehicle-info">
                    <span>Miejsce stałego parkowania</span>
                    <span>{props.parking}</span>
                </div>
                <div className="vehicle-info route-info">
                    <span>Dostępność tras</span>
                    <span>
                        <p>{props.oneWayTrack}</p> 
                        <p>{props.returnTrack}</p>
                    </span>
                </div>
                <button>Szczegóły</button>
            </div>
        </div>
    );
}

export default Vehicle;
