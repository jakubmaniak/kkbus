import React, { useEffect, useState, useContext } from 'react';

import * as api from '../api';
import { routeFormatter } from '../helpers/text-formatters';

import Dropdown from './Dropdown';
import '../styles/TrackReport.css';
import UserContext from '../contexts/User';


function TrackReport() {
    let [courses, setCourses] = useState([]);
    let [stops, setStops] = useState([]);
    let { role } = useContext(UserContext).user;

    useEffect(() => {
        api.getAllRoutes()
            .then((routes) => {
                courses = [];
                for (let route of routes) {
                    courses.push({
                        routeId: route.id,
                        direction: 'a',
                        name: route.a.departureLocation + ' - ' + route.b.departureLocation,
                        stops: route.a.stops
                    });
                    courses.push({
                        routeId: route.id,
                        direction: 'b',
                        name: route.b.departureLocation + ' - ' + route.a.departureLocation,
                        stops: route.b.stops
                    });
                }
                setCourses(courses);
            })
            .catch(api.errorAlert);
    }, []);

    function handleRouteChange(route) {
        setStops(route.stops);
    }

    return (
        <div className="track-report page">
            <div className="main">
                <div className="tile half">
                    <h2>
                        Raport z kursu
                        {role === 'owner' ? <span style={{fontSize:"20px", color: "rgb(217 180 48)"}}> (dla kierowców)</span> : null}
                    </h2>
                    <form className="report">
                        <Dropdown
                            items={courses}
                            textProperty="name"
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
