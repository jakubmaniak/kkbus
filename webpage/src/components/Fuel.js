import React, { useEffect, useState } from 'react';

import * as api from '../api';
import FuelHistoryItem from './FuelHistoryItem';
import FuelUsageChart from './FuelUsageChart';
import Dropdown from './Dropdown';
import { ModalLoader } from './Loader';

import '../styles/Fuel.css';

function Fuel() {
    let [loading, setLoading] = useState(true);
    let loadingInitTime = Date.now();

    let [fuelUsage, setFuelUsage] = useState([]);
    let [vehicle, setVehicle] = useState('');
    let [vehicles, setVehicles] = useState([]);

    useEffect(() => {
        api.getAllVehicles().then((vehicles) => {
            setVehicles(vehicles);
            setTimeout(() => {
                setLoading(false);
            }, Math.max(0, 250 - (Date.now() - loadingInitTime)));
        });
    }, []);

    function handleVehicleChange(item) {
        let vehicleId = item.id;

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
            <ModalLoader loading={loading} />
            <div className="main">
                    <div className="tile half select">
                        <h2>Pojazd</h2>
                        <Dropdown 
                            items={vehicles}
                            textFormatter={({ brand, model, year }) => brand + ' ' + model + ' ' + year}
                            placeholder="Wybierz pojazd"
                            handleChange={handleVehicleChange}
                        />
                    </div>
                    <div className="tile break-row"></div>
                    <div className="tile half">
                        <h2>Tankowanie</h2>
                        <form className="fuel-form">
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
                        <div className="fuel-usage-history-items">
                        {fuelUsage.map((refueling, index) => {
                            return (
                                <FuelHistoryItem 
                                    key={index}
                                    date={refueling.date}
                                    price={refueling.cost}
                                    liters={refueling.amount}
                                    vehicleMileage={refueling.mileage}
                                />      
                            );
                        })}
                        </div>
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