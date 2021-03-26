import React, { useEffect, useState } from 'react';

import * as api from '../api';
import { routeFormatter } from '../helpers/text-formatters';

import '../styles/WorkSchedule.css';
import Dropdown from './Dropdown';
import Loader from './Loader';
import WorkScheduleItem from './WorkScheduleItem';

function WorkSchedule() {
    let [loading, setLoading] = useState(false);
    
    let [selectedDriver, setSelectedDriver] = useState();
    let [selectedRoute, setSelectedRoute] = useState();
    let [selectedRange, setSelectedRange] = useState();

    let [drivers, setDrivers] = useState([]);
    let [routes, setRoutes] = useState(['wszystkie']);
    let [ranges] = useState([
        [0, 'dzisiaj'],
        [1, 'jutro'],
        [7, '7 kolejnych dni'],
        [31, 'ten miesiąc']
    ]);

    let [results, setResults] = useState([]);

    useEffect(() => {
        api.getDrivers()
            .then(setDrivers)
            .catch(api.errorAlert);

        api.getAllRoutes()
            .then((routes) => setRoutes(['wszystkie'].concat(routes)))
            .catch(api.errorAlert);
    }, []);

    useEffect(() => {
        if (!selectedDriver) return;

        setResults([]);
        setLoading(true);

        let start = Date.now();

        let routeId = null;
        if (typeof selectedRoute === 'object') routeId = selectedRoute.id;

        api.getWorkSchedule(selectedDriver[0], selectedRange[0], routeId)
            .then((results) => {
                if (Date.now() - start > 250) {
                    setResults(results);
                    setLoading(false);
                }
                else {
                    setTimeout(() => {
                        setResults(results);
                        setLoading(false);
                    }, 500 - (Date.now() - start));
                }
            })
            .catch(api.errorAlert);
    }, [selectedDriver, selectedRoute, selectedRange]);  

    return (
        <div className="work-schedule page">
            <div className="main">
                <div className="tile">
                    <h2>Filtry</h2>
                    <div className="row-filter-container">
                        <div className="filter-container">
                            <span>Kierowca:</span>
                            <Dropdown
                                items={drivers}
                                textProperty="1"
                                placeholder="Wybierz kierowcę"
                                handleChange={setSelectedDriver} />
                        </div>
                        <div className="filter-container">
                            <span>Trasy:</span>
                            <Dropdown
                                items={routes}
                                textFormatter={routeFormatter}
                                alwaysSelected
                                handleChange={setSelectedRoute} />
                        </div>
                    </div>
                    <div className="row-filter-container">
                        <div className="filter-container">
                            <span>Zakres dni:</span>
                            <Dropdown
                                items={ranges}
                                textProperty="1"
                                alwaysSelected
                                handleChange={setSelectedRange} />
                        </div>
                    </div>
                </div>
                <Loader loading={loading} />
                {(!loading && results.length == 0) ? <p className="no-results">Brak wyników</p> : null}
                {results.map((element, i) => {
                    return (
                        <WorkScheduleItem 
                            key={i}
                            start={element.start}
                            end={element.end}
                            day={element.day}
                            hour={element.hour}
                            vehicle={element.vehicle}
                            parking={element.parking}
                            parkingInfo={element.parkingInfo}
                        />
                    );
                })}
            </div>
        </div>
    );
}

export default WorkSchedule;
