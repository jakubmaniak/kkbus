import React, { useEffect, useState } from 'react';

import * as api from '../api';
import Vehicle from './Vehicle';

import '../styles/VehicleInfo.css';

function VehicleInfo() {    
    let [vehicles, setVehicles] = useState([]);

    useEffect(() => {
        api.getAllVehicles()
        .then(setVehicles);

        console.log(vehicles);
    }, []);

    return (
        <div className="vehicle-info-page page">
            <div className="main">
                {vehicles.map((vehicle, index) => {
                    return (
                        <Vehicle key={index}
                            plate={vehicle.plate}
                            model={vehicle.model}
                            brand={vehicle.brand}
                            year={vehicle.year}
                            state={vehicle.state}
                            parking={vehicle.parking}
                            seats={vehicle.seats} 
                            oneWayTrack={vehicle.ab}
                            returnTrack={vehicle.ba}
                            vehicleMileage={vehicle.mileage}
                            combustion={vehicle.combustion}
                            // currentDriver={vehicle.currentDriver}
                        />
                    );
                })}
            </div>
        </div>
    );
}

export default VehicleInfo;
