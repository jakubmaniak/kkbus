import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';

import '../styles/FuelPage.css';

import * as api from '../api';
import { fromValue } from '../helpers/from-value';
import toast from '../helpers/toast';

import FuelHistoryItem from './FuelHistoryItem';
import FuelUsageChart from './FuelUsageChart';
import Dropdown from './Dropdown';
import Loader, { ModalLoader } from './Loader';


function FuelPage() {
    let [loading, setLoading] = useState(true);
    let [dataLoading, setDataLoading] = useState(false);

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
                setLoading(false);
            })
            .catch(api.toastifyError);
    }, []);

    function handleVehicleChange(item) {
        let vehicleId = item.id;

        setVehicleId(vehicleId);
        setDataLoading(true);
        getData(vehicleId);
    }

    function getData(vehicleId) {
        api.getRefuels(vehicleId)
            .then((result) => {
                result = result.map((refuel) => {
                    refuel.date = dayjs(refuel.date);
                    return refuel;
                });
                setRefuels(result);
                setDataLoading(false);
            })
            .catch(api.toastifyError);
    }

    function saveRefuelReport() {
        if (vehicleId === -1) {
            toast.error('Nie wybrano pojazdu');
            return;
        }

        let _fuelCost = parseFloat(fuelCost);
        let _fuelAmount = parseFloat(fuelAmount);
        let _vehicleMileage = parseFloat(vehicleMileage);        

        if (isNaN(_fuelCost) || _fuelCost < 0) {
            toast.error('Wprowadzony koszt paliwa jest niepoprawny');
            return;
        }

        if (isNaN(_fuelAmount) || _fuelAmount <= 0) {
            toast.error('Wprowadzona ilość paliwa jest niepoprawna');
            return;
        }

        if (isNaN(_vehicleMileage) || _vehicleMileage < 0) {
            toast.error('Wprowadzony przebieg pojazdu jest niepoprawny');
            return;
        }

        api.addRefuel(vehicleId, _fuelAmount, _fuelCost, _vehicleMileage)
            .then((result) => {
                setFuelCost('');
                setFuelAmount('');
                setVehicleMileage('');
                setRefuels([
                    {
                        id: result.id,
                        amount: _fuelAmount,
                        cost: _fuelCost,
                        mileage: _vehicleMileage,
                        date: dayjs()
                    },
                    ...refuels
                ]);
                toast.success('Dodano raport tankowania');
            })
            .catch(api.toastifyError);
    }

    function display(node) {
        if (dataLoading) return <Loader/>;
        if (refuels.length == 0) return 'Brak raportów z tankowania w archiwum';
        return node;
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
                    {
                        (vehicleId !== -1)
                        ? <>
                            <div className="tile half right">
                                <h2>Historia tankowania</h2>
                                {display(<>
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
                                                date={refuel.date.format('YYYY.MM.DD HH:mm')}
                                                price={refuel.cost}
                                                liters={refuel.amount}
                                                vehicleMileage={refuel.mileage}
                                            />      
                                        );
                                    })}
                                    </div>
                                </>)}
                            </div>
                            <div className="tile half">
                                <h2>Zużycie paliwa</h2>    
                                {display(
                                    <FuelUsageChart values={refuels.map((refuel) => refuel.amount)} />
                                )}
                            </div>
                        </>
                        : null
                    }
                </div>
        </div>
    );
}

export default FuelPage;