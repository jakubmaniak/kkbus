import React, { useState } from 'react';

import { useValue } from '../helpers/use-value';
import * as api from '../api';

import '../styles/Fuel.css';

function Fuel() {
    const [fuelUsage, setFuelUsage] = useState([]);
    const [vehicle, setVehicle] = useState('');

    function handleVehicleChange(ev) {
        let vehicleId = parseInt(ev.target.value);

        setVehicle(vehicleId || '');
        getData(vehicleId || null);
    }

    function getData(vehicleId) {
        api.getFuelUsage(vehicleId).then((data) => {
            setFuelUsage(data);
        })
        .catch(api.errorAlert);
    }

    return (
        <div class="fuel-usage-page page">
            <div class="main left-aligned">
                <div className="half tile">
                    <span>Pojazd:</span>
                    <input value={vehicle} onChange={handleVehicleChange} />
                </div>
                <div className="half tile break-row"></div>
                <div className="half tile fuel-usage-new">
                    <header>Tankowanie</header>
                </div>
                <div className="half tile fuel-usage-history">
                    <header>Historia tankowania</header>
                </div>
                <div className="half tile fuel-usage-stats">
                    <header>Zużycie paliwa</header>
                    <div class="content">
                        <svg viewBox="0 0 446 156" width="446" height="156" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                                <linearGradient id="bg" x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" />
                                    <stop offset="100%"/>
                                </linearGradient>
                            </defs>
                            <polyline
                                className="fill"
                                points={
                                    '0,156 ' +
                                    fuelUsage.map((entity, i, array) =>
                                        (i * (446 / (array.length - 1))) +
                                        ',' +
                                        (entity.amount - 30) * 10
                                    ) +
                                    ' 446,156'
                                } />
                            <polyline
                                className="stroke"
                                points={
                                    fuelUsage.map((entity, i, array) =>
                                        (i * (446 / (array.length - 1))) +
                                        ',' +
                                        (entity.amount - 30) * 10
                                    )
                                } />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Fuel;