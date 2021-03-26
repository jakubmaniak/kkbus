import React, { useEffect, useState } from 'react';

import * as api from '../api';
import { routeFormatter } from '../helpers/text-formatters';

import Dropdown from './Dropdown';
import '../styles/TrackReport.css';

function TrackReport() {
    let [routes, setRoutes] = useState([]);
    let [stops, setStops] = useState([]);

    useEffect(() => {
        api.getAllRoutes()
        .then(setRoutes);
    }, []);

    function handleRouteChange(route) {
        setStops(route.stops);
    }

    return (
        <div className="track-report page">
            <div className="main">
                <div className="tile half">
                    <h2>Raport z kursu</h2>
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
                        <button className="submit">Zapis raport</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default TrackReport;
