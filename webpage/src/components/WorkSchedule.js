import React, { useEffect, useState } from 'react';

import * as api from '../api';

import '../styles/WorkSchedule.css';
import Dropdown from './Dropdown';
import Loader from './Loader';
import WorkScheduleItem from './WorkScheduleItem';

function WorkSchedule() {
    let [loading, setLoading] = useState(false);
    
    let [selectedDriver, setSelectedDriver] = useState();
    let [selectedRoute, setSelectedRoute] = useState();
    let [selectedRange, setSelectedRange] = useState();
    let [selectedDirection, setSelectedDirection] = useState();

    let [drivers, setDrivers] = useState([]);
    let [routes, setRoutes] = useState([
        [null, 'wszystkie']
    ]);
    let [ranges] = useState([
        [0, 'dzisiaj'],
        [1, 'jutro'],
        [7, '7 kolejnych dni'],
        [31, 'ten miesiąc']
    ]);
    let [directions] = useState([
        [0, 'obydwa'],
        [1, 'A -> B'],
        [-1, 'B -> A']
    ]);

    let [results, setResults] = useState([]);

    useEffect(() => {
        api.getDrivers()
            .then(setDrivers)
            .catch(api.errorAlert);

        api.getRoutes()
            .then((routes) => {
                setRoutes([[null, 'wszystkie']].concat(routes))
            })
            .catch(api.errorAlert);
    }, []);

    useEffect(() => {
        console.log({selectedDriver, selectedRoute, selectedDirection, selectedRange});
        if (!selectedDriver) return;

        setResults([]);
        setLoading(true);

        let start = Date.now();

        api.getWorkSchedule(selectedDriver[0], selectedRange[0], selectedRoute[0], selectedDirection[0])
            .then((results) => {
                if (Date.now() - start > 500) {
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
    }, [selectedDriver, selectedRoute, selectedDirection, selectedRange]);  

    return (
        <div className="work-schedule-page">
            <div className="main">
                <div className="tile">
                    <h2>Filtry</h2>
                    <div className="row-container">
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
                                textProperty="1"
                                alwaysSelected
                                handleChange={setSelectedRoute} />
                        </div>
                    </div>
                    <div className="row-container">
                        <div className="filter-container">
                            <span>Zakres dni:</span>
                            <Dropdown
                                items={ranges}
                                textProperty="1"
                                alwaysSelected
                                handleChange={setSelectedRange} />
                        </div>
                        <div className="filter-container">
                            <span>Kierunki:</span>
                            <Dropdown
                                items={directions}
                                textProperty="1"
                                alwaysSelected
                                handleChange={setSelectedDirection} />
                        </div>
                    </div>
                </div>
                <Loader loading={loading} />
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
