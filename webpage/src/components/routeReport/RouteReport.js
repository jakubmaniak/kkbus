import React, { useState, useEffect } from 'react';
import '../../styles/RouteReport.css';
import Dropdown from '../dropdowns/Dropdown';
import * as api from '../../api';


function RouteReport() {
    let [routes, setRoutes] = useState([]);
    let [drivers, setDrivers] = useState([]);
    let [vehicles, setVehicles] = useState([]);

    let [selectedRoute, setSelectedRoute] = useState();
    let [selectedDriver, setSelectedDriver] = useState();
    let [selectedVehicle, setSelectedVehicle] = useState();

    useEffect(() => {
        api.getAllRoutes()
            .then(setRoutes)
            .catch(api.toastifyError);
        api.getDriverNames()
            .then(setDrivers)
            .catch(api.toastifyError);
        api.getAllVehicles()
            .then(setVehicles)
            .catch(api.toastifyError);
    }, []);


    return (
        <div className="route-report page">
            <div className="main">
                <div className="tile">
                    <h2>Raporty z kursów</h2>
                    <div className="row-filter-container">
                        <Dropdown 
                            placeholder='Wybierz trasę'
                            items={routes}
                            textFormatter={({ departureLocation, arrivalLocation }) => departureLocation + ' - ' + arrivalLocation}
                            handleChange={setSelectedRoute}
                        />
                        <Dropdown 
                            placeholder="Wybierz pojazd"
                            items={vehicles}
                            textFormatter={({ brand, model, year }) => brand + ' ' + model + ' ' + year}
                            handleChange={setSelectedVehicle}
                        />
                    </div>
                    <div className="row-filter-container">
                        <Dropdown 
                            placeholder="Wybierz kierowcę"
                            items={drivers}
                            textFormatter={({ firstName, lastName }) => firstName + ' ' + lastName}
                            handleChange={setSelectedDriver}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RouteReport;
