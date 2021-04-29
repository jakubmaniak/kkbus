import React, { useEffect, useState } from 'react';
import '../styles/FuelPage.css';

import * as api from '../api';
import { fromValue } from '../helpers/from-value';

import FuelHistoryItem from './FuelHistoryItem';
import FuelUsageChart from './FuelUsageChart';
import Dropdown from './Dropdown';
import { ModalLoader } from './Loader';


function FuelPage() {
    let [loading, setLoading] = useState(true);
    let loadingInitTime = Date.now();

    let [refuels, setRefuels] = useState([]);
    let [vehicleId, setVehicleId] = useState(-1);
    let [vehicles, setVehicles] = useState([]);
    let [fuelCost, setFuelCost] = useState('');
    let [fuelAmount, setFuelAmount] = useState('');
    let [vehicleMileage, setVehicleMileage] = useState('');

    useEffect(() => {
        api.getAllVehicles()
            .then((vehicles) => {
                setVehicles(vehicles);
                setTimeout(() => {
                    setLoading(false);
                }, Math.max(0, 250 - (Date.now() - loadingInitTime)));
            })
            .catch(api.errorAlert);
    }, []);

    function handleVehicleChange(item) {
        let vehicleId = item.id;

        setVehicleId(vehicleId);
        getData(vehicleId);
    }

    function getData(vehicleId) {
        api.getRefuels(vehicleId)
            .then(setRefuels)
            .catch(api.errorAlert);
    }

    function saveRefuelReport() {
        if (vehicleId === -1) {
            alert('Nie wybrano pojazdu');
            return;
        }

        let _fuelCost = parseFloat(fuelCost);
        let _fuelAmount = parseFloat(fuelAmount);
        let _vehicleMileage = parseFloat(vehicleMileage);        

        if (isNaN(_fuelCost) || _fuelCost < 0) {
            alert('Wprowadzony koszt paliwa jest niepoprawny');
            return;
        }

        if (isNaN(_fuelAmount) || _fuelAmount <= 0) {
            alert('Wprowadzona ilość paliwa jest niepoprawna');
            return;
        }

        if (isNaN(_vehicleMileage) || _vehicleMileage < 0) {
            alert('Wprowadzony przebieg pojazdu jest niepoprawny');
            return;
        }

        api.addRefuel(vehicleId, _fuelAmount, _fuelCost, _vehicleMileage)
            .then(() => {
                setFuelCost('');
                setFuelAmount('');
                setVehicleMileage('');
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
                            <input placeholder="Koszt tankowania [PLN]"
                                value={fuelCost}
                                onChange={fromValue(setFuelCost)} />
                            <input placeholder="Ilośc zatankowanego paliwa [L]"
                                value={fuelAmount}
                                onChange={fromValue(setFuelAmount)} />
                            <input placeholder="Przebieg pojazdu [KM]"
                                value={vehicleMileage}
                                onChange={fromValue(setVehicleMileage)} />
                            <button type="button" className="submit" onClick={saveRefuelReport}>Zapisz tankowanie</button>
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
                        {refuels.map((refuel, index) => {
                            return (
                                <FuelHistoryItem 
                                    key={index}
                                    date={refuel.date}
                                    price={refuel.cost}
                                    liters={refuel.amount}
                                    vehicleMileage={refuel.mileage}
                                />      
                            );
                        })}
                        </div>
                    </div>
                    <div className="tile half">
                        <h2>Zużycie paliwa</h2>
                        <FuelUsageChart values={refuels.map((refuel) => refuel.amount)} />
                    </div>
                </div>
        </div>
    );
}

export default FuelPage;