import React, { useEffect, useState, useContext } from 'react';
import '../styles/RouteReport.css';

import * as api from '../api';
import { routeFormatter } from '../helpers/text-formatters';
import UserContext from '../contexts/User';
import toast from '../helpers/toast';
import { fromValue } from '../helpers/from-value';

import Dropdown from './Dropdown';

function RouteReport() {
    let [routes, setRoutes] = useState([]);
    let [stops, setStops] = useState([]);
    let [vehicles, setVehicles] = useState([]);

    let [selectedRoute, setSelectedRoute] = useState();
    let [selectedStop, setSelectedStop] = useState();
    let [selectedVehicle, setSelectedVehicle] = useState();
    let [amount, setAmount] = useState('');

    let { role } = useContext(UserContext).user;

    useEffect(() => {
        api.getAllRoutes()
            .then(setRoutes)
            .catch(api.toastifyError);

        api.getAllVehicles()
            .then(setVehicles)
            .catch(api.toastifyError);
    }, []);

    function handleRouteChange(route) {
        setStops(route.stops);
        setSelectedRoute(route);
    }

    function saveReport() {
        let currentAmount = parseInt(amount, 10);
        
        if(isNaN(amount) || currentAmount < 0) {
            toast.error('Wprowadzono niepoprawną liczbę osób');
            return;
        }
        if(!selectedRoute || !selectedStop || !selectedVehicle) {
            toast.error('Wprowadzone dane są niepoprawne');
            return;
        }
        
        console.log(selectedRoute.id, selectedStop, selectedVehicle.id, currentAmount);

        api.addRouteReport(selectedRoute.id, selectedStop, selectedVehicle.id, currentAmount)
        .then(() => toast.success('Dodano raport'))
        .catch(api.toastifyError);
    }

    return (
        <div className="route-report page">
            <div className="main">
                <div className="tile half">
                    <h2>
                        Raport z kursu
                        {role === 'owner' ? <span style={{fontSize:"20px", color: "rgb(217 180 48)"}}> (dla kierowców)</span> : null}
                    </h2>
                    <form className="report">
                        <Dropdown
                            items={routes}
                            textFormatter={routeFormatter}
                            placeholder="Wybierz trasę"
                            handleChange={handleRouteChange} 
                        />
                        <Dropdown
                            items={stops}
                            placeholder="Wybierz przystanek" 
                            handleChange={setSelectedStop}
                        />
                        <Dropdown
                            items={vehicles}
                            textFormatter={({ brand, model, year }) => brand + ' ' + model + ' ' + year}
                            placeholder="Wybierz pojazd" 
                            handleChange={setSelectedVehicle} 
                        />
                        <input placeholder="Liczba osób" value={amount} onChange={fromValue(setAmount)} />
                        <button className="submit" type="button" onClick={saveReport}>Zapisz raport</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default RouteReport;
