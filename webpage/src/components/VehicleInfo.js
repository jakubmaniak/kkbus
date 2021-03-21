import React, { useEffect, useState } from 'react';

import * as api from '../api';
import Vehicle from './Vehicle';

import '../styles/VehicleInfo.css';

function VehicleInfo() {    
    let [vehicles, setVehicles] = useState([]);

    useEffect(() => {
        api.getAllVehicles().then(setVehicles);
    }, []);

    return (
        <div className="vehicle-info-page page">
            <div className="main">
                {vehicles.map((vehicle, index) => {
                    return (
                        <Vehicle key={index}
                            vehicleRegistration={vehicle.registration}
                            name={vehicle.name} 
                            state={vehicle.state}
                            parking={vehicle.parking}
                            seats={vehicle.seats} 
                            oneWayTrack={vehicle.oneWayTrack}
                            returnTrack={vehicle.returnTrack}
                            vehicleMileage={vehicle.mileage}
                            avgCombustion={vehicle.avgCombustion}
                            currentDriver={vehicle.currentDriver}
                        />
                    );
                })}
            </div>
        </div>
    );
}

export default VehicleInfo;
