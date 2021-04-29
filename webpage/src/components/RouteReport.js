import React, { useEffect, useState, useContext } from 'react';
import '../styles/RouteReport.css';

import * as api from '../api';
import { routeFormatter } from '../helpers/text-formatters';
import UserContext from '../contexts/User';

import Dropdown from './Dropdown';


function RouteReport() {
    let [routes, setRoutes] = useState([]);
    let [stops, setStops] = useState([]);

    let { role } = useContext(UserContext).user;

    useEffect(() => {
        api.getAllRoutes()
            .then(setRoutes)
            .catch(api.toastifyError);
    }, []);

    function handleRouteChange(route) {
        setStops(route.stops);
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
                            handleChange={handleRouteChange} />
                        <Dropdown
                            items={stops}
                            placeholder="Wybierz przystanek" />
                        <input placeholder="Liczba osób" />
                        <button className="submit">Zapisz raport</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default RouteReport;
