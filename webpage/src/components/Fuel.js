import React, { useState } from 'react';

import * as api from '../api';
import FuelHistoryItem from './FuelHistoryItem';
import FuelUsageChart from './FuelUsageChart';
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
        }
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
        <div className="fuel-usage page">
            <div className="main">
                    <div className="tile half select">
                        <h2>Pojazd</h2>
                        <Dropdown 
                            items={vehicles}
                            textProperty="vehicleName"
                            placeholder="Wybierz pojazd"
                            handleChange={handleVehicleChange}
                        />
                    </div>
                    <div className="tile break-row"></div>
                    <div className="tile half">
                        <h2>Tankowanie</h2>
                        <form>
                            <input placeholder="Koszt tankowania [PLN]"/>
                            <input placeholder="Ilośc zatankowanego paliwa [L]"/>
                            <input placeholder="Przebieg pojazdu [KM]"/>
                            <button className="submit">Zapisz tankowanie</button>
                        </form>
                    </div>
                    <div className="tile half right">
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
                    <div className="tile half">
                        <h2>Zużycie paliwa</h2>
                        <FuelUsageChart values={fuelUsage.map((e) => e.amount)} />
                    </div>
                </div>
        </div>
    );
}

export default Fuel;