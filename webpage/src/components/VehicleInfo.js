import React, { useEffect, useState } from 'react';

import * as api from '../api';
import Vehicle from './Vehicle';

import '../styles/VehicleInfo.css';

function VehicleInfo() {    
    let [vehicles, setVehicles] = useState([]);

    useEffect(() => {
        updateVehicle();
    }, []);

    function updateVehicle() {
        api.getAllVehicles()
        .then(setVehicles);
    }

    function deleteVehicle(vehicleId) {
        let vehicle = vehicles.find(({id}) => id === vehicleId);
        let index = vehicles.indexOf(vehicle);  

        api.deleteVehicle(vehicleId);

        vehicles.splice(index, 1);
        setVehicles(vehicles);
        
        updateVehicle();
    }

    return (
        <div className="vehicle-info-page page">
            <div className="main">
                {vehicles.map((vehicle) => {
                    return (
                        <Vehicle key={vehicle.id}
                            vehicleId={vehicle.id}
                            plate={vehicle.plate}
                            model={vehicle.model}
                            brand={vehicle.brand}
                            year={vehicle.year}
                            state={vehicle.state}
                            parking={vehicle.parking}
                            seats={vehicle.seats} 
                            oneWayTrack={vehicle.ab}
                            returnTrack={vehicle.ba}
                            mileage={vehicle.mileage}
                            combustion={vehicle.combustion}
                            updateVehicle={updateVehicle}
                            deleteVehicle={() => deleteVehicle(vehicle.id)}
                            // currentDriver={vehicle.currentDriver}
                        />
                    );
                })}
            </div>
        </div>
    );
}

export default VehicleInfo;
