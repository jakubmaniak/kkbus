import React, { useState } from 'react';

import { useValue } from '../helpers/use-value';
import * as api from '../api';
import FuelHistoryItem from './FuelHistoryItem';
import Dropdown from './Dropdown';

import '../styles/Fuel.css';

function Fuel() {
    let [fuelUsage, setFuelUsage] = useState([]);
    let [vehicle, setVehicle] = useState('');
    let [vehicles, setVehicles] = useState([
        { vehicleName: 'Mercedes Sprinter', vehicleId: 2 },
        { vehicleName: 'Ford Transit', vehicleId: 5 }
    ]);

    let fuelHistory = [
        {
            date: '02.03.2021 15:09',
            price: 203.45,
            liters: 40.7, 
            vehicleMileage:'1 330 087'
        },
        {
            date: '02.03.2021 15:09',
            price: 203.45,
            liters: 40.7, 
            vehicleMileage:'1 330 087'
        },
        {
            date: '02.03.2021 15:09',
            price: 203.45,
            liters: 40.7, 
            vehicleMileage:'1 330 087'
        },
        {
            date: '02.03.2021 15:09',
            price: 203.45,
            liters: 40.7, 
            vehicleMileage:'1 330 087'
        },
        {
            date: '02.03.2021 15:09',
            price: 203.45,
            liters: 40.7, 
            vehicleMileage:'1 330 087'
        },
        {
            date: '02.03.2021 15:09',
            price: 203.45,
            liters: 40.7, 
            vehicleMileage:'1 330 087'
        },
        {
            date: '02.03.2021 15:09',
            price: 203.45,
            liters: 40.7, 
            vehicleMileage:'1 330 087'
        },
    ];

    function handleVehicleChange(item) {
        let vehicleId = item.vehicleId;

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
        <div className="fuel-usage-page">
            <div className="main">
                <div className="left-side">
                    <div className="tile select">
                        <h2>Pojazd</h2>
                        <Dropdown 
                            items={vehicles}
                            textProperty="vehicleName"
                            placeholder="Wybierz pojazd"
                            handleChange={handleVehicleChange}
                        />
                    </div>
                    <div className="tile">
                        <h2>Tankowanie</h2>
                        <form>
                            <input placeholder="Koszt tankowania [PLN]"/>
                            <input placeholder="Ilośc zatankowanego paliwa [L]"/>
                            <input placeholder="Przebieg pojazdu [KM]"/>
                            <button className="submit">Zapisz tankowanie</button>
                        </form>
                    </div>
                    <div className="tile">
                        <h2>Zużycie paliwa</h2>
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
                <div className="right-side">
                    <div className="tile">
                        <h2>Historia tankowania</h2>
                        <div className="fuel-usage-history header">
                            <span>Data</span>
                            <span>Koszt</span>
                            <span>Ilość</span>
                            <span>Przebieg</span>
                        </div>
                        {fuelHistory.map((refueling, index) => {
                            return (
                                <FuelHistoryItem 
                                    key={index}
                                    date={refueling.date}
                                    price={refueling.price}
                                    liters={refueling.liters}
                                    vehicleMileage={refueling.vehicleMileage}
                                />      
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Fuel;